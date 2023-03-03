// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import {PermitControl} from "./access/PermitControl.sol";
import {EIP712} from "./libraries/EIP712.sol";
import {LienNft} from "../LienNft.sol";
import {VaultReceiptNft} from "../VaultReceiptNft.sol";

/// Thrown if attempting to set the validator address to zero.
error ValidatorAddressCannotBeZero();

/// Thrown if the signature provided by the validator is invalid.
error BadSignature();

/// Thrown if the signature provided by the validator is expired.
error SignatureExpired();

/// Thrown if attempting to propose a loan exceeding the Vault floor.
error OfferExceedsFloor();

error InvalidShare();

/// Prevent callers from canceling the offers of others.
error CanOnlyCancelOwnProposal();

/// Prevent callers from canceling non-pending offers.
error CanOnlyCancelPendingProposal();

/// Prevent callers from accepting non-pending offers.
error CanOnlyAcceptPendingProposal();

/// Prevent the contract from accepting NFT transfers that it cannot handle.
error InvalidTransfer();

/// Prevent the contract from minting liens until the collateral is received.
error MissingCollateral();

/// Prevent replay of liquidation attacks.
error LiquidationAlredyStarted();

/// Prevent callers from fire-saleing the Vault for less than the total liens outstanding value.
error InvalidSalePrice();

/**
	@custom:benediction DEVS BENEDICAT ET PROTEGAT CONTRACTVS MEAM
	@title A contract to support creation of liens for an NFT.

	This contract allows an NFT holder to retain some ownership benefits of their item while 
	negotiating and/or holding liens against it.
*/
contract Vault is EIP712, PermitControl, ReentrancyGuard, IERC721Receiver, ERC1155Receiver {
  /// The `transferFrom` selector for ERC-20 and ERC-721 tokens.
  bytes4 private constant _TRANSFER_FROM_SELECTOR = 0x23b872dd;

  /// The public identifier for the right to change the validator address.
  bytes32 public constant VALIDATOR_SETTER = keccak256("VALIDATOR_SETTER");

  /// The public identifier for the right to accept loans.
  bytes32 public constant LOAN_ACCEPT = keccak256("LOAN_ACCEPT");

  /// The public identifier for the right to begin liquidation.
  bytes32 public constant LIQUIDATE = keccak256("LIQUIDATE");

  /// The EIP-712 typehash of a floor price update.
  bytes32 public constant FLOOR_TYPEHASH = keccak256("Floor(address submitter,uint256 floorPrice,uint256 deadline)");

  uint256 public constant MAX_EQUITY_SUPPLY = 1e18;

  /// A tokenId for the next offer to create.
  uint256 public nextOfferId = 0;

  /// The total number of unminted shares in the Vault.
  uint256 public availableEquity = 0;

  /// The address of the off-chain validator signer.
  address public validator;

  /// The address of the shared receipt emmiter contract.
  VaultReceiptNft public receiptMinter;

  /// The address of the associated lien emmiter contract.
  LienNft public lienMinter;

  /// The address of the shared floor price oracle contract.
  address public oracle;

  /// The collection address of the NFT locked in this Vault.
  address public collection;

  /// The tokenId of the NFT locked in this Vault.
  uint256 public colateralId;

  /// The uri of the receipt NFT for this Vault.
  string public receiptUri;

  /// The tokenId of the receipt NFT for this Vault.
  uint256 public receiptId = 0;

  /// The total amount of the liquidation sale for this Vault's NFT.
  uint256 public salePrice = 0;

  /// The collection floor price right before the time of the liquidation sale.
  uint256 public endPriceFloor = 0;

  // The current liquidation amount to be paid out to the lien holders.
  uint256 public liquidationPayout = 0;

  /**
		This struct encodes details about each loan offer.
		// discount = share - intent

		@param intent The intended percent of ownership to pay for at which `share`
			share of the Vault is obtained.
		@param share The share of the Vault that the loan is proposed for.
		@param deadline The deadline after which this offer cannot be accepted.
		@param value The underlying Ether value escrowed in this offer.
		@param proposer The address of the proposer.
		@param status The status of the offer (closed, pending, accepted).
	*/
  struct Offer {
    uint256 epXpm; // 18 decimals
    uint256 equity; // 18 decimals
    uint256 deadline; // timestamp
    uint256 value; // 18 decimals
    address proposer;
    uint256 status; // 1 = pending, 2 = accepted, 3 = canceled
    uint256 dailyFee; // 2 decimals
    uint256 dailyLPInterest; // 18 decimals
    // TODO: Maintenance fee support.
  }

  /// Store each Offer against its ID.
  mapping(uint256 => Offer) public offers;

  /// A mapping correlating a bidder to each of their offers.
  // mapping(address => uint[]) public callerOffers;

  /**
		This event is emitted whenever a loan is proposed.

		@param proposer The address which has proposed a loan offer on this Vault.
    @param intent `Price Multiplier` multiplied by `Equity Percentage`
		@param share The share of the Vault that the proposer would obtain.
		@param deadline The deadline to which the loan offer is valid.
    @param offerId The ID of the offer.
	*/
  event LoanProposed(address indexed proposer, uint256 intent, uint256 share, uint256 deadline, uint256 offerId);

  /**
		This event is emitted whenever a loan is accepted.

    @param offerId The ID of the accepted offer.
    @param share The accepted share of the Vault that the proposer will obtain.
	*/
  event LoanAccepted(uint256 offerId, uint256 share);

  /**
		This event is emitted whenever a loan proposal is canceled.

    @param from The address which canceled the offer.
		@param offerId The ID of the canceled offer.
	*/
  event ProposalCanceled(address indexed from, uint256 offerId);

  /**
		Construct a new instance of this.

		@param _oracle The address to use as the oracle for the floor price.
    @param _receiptMinter The address of the receipt minter contract.
    @param _lienMinter The address of the lien minter contract.
    @param _collection The address of the collection of the NFT locked in this Vault.
    @param _collateralId The tokenId of the NFT locked in this Vault.
    @param _receiptUri The uri of the receipt NFT for this Vault.
	*/
  constructor(
    address _oracle,
    VaultReceiptNft _receiptMinter,
    LienNft _lienMinter,
    address _collection,
    uint256 _collateralId,
    string memory _receiptUri
  ) {
    oracle = _oracle;
    receiptMinter = _receiptMinter;
    lienMinter = _lienMinter;
    collection = _collection;
    colateralId = _collateralId;
    receiptUri = _receiptUri;
  }

  /**
   * @dev Returns the address of the current owner of the receipt NFT.
   */
  function getCollateralOwner() public view returns (address) {
    return IERC721(collection).ownerOf(colateralId);
  }

  /**
   * @dev Throws if called by any account other than the collateral owner.
   */
  modifier isCollateralOwner() {
    require(IERC721(collection).ownerOf(colateralId) == msg.sender, "Not collateral owner");
    _;
  }

  /**
		Return the list of all proposed offers.
	*/
  function getOffers() external view returns (Offer[] memory) {
    Offer[] memory _offers = new Offer[](nextOfferId);
    for (uint256 i = 0; i < nextOfferId; ++i) {
      _offers[i] = offers[i];
    }
    return _offers;
  }

  /**
		Change the `validator` address.

		@param _validator The new `validator` address to set.

		@custom:throws ValidatorAddressCannotBeZero if attempting to set the 
			`validator` address to the zero address.
	*/
  function changeValidator(address _validator) external hasValidPermit(UNIVERSAL, VALIDATOR_SETTER) {
    if (_validator == address(0)) {
      revert ValidatorAddressCannotBeZero();
    }
    validator = _validator;
  }

  /**
		Generate a hash from the floor price parameters.
		
		@param _submitter The address allowed to submit a floor price signature.
		@param _floorPrice The asset floor price.
		@param _deadline The time when the `_submitter` loses the right to use the
			signature.

		@return _ The hash of the parameters for checking signature validation.
	*/
  function _hash(address _submitter, uint256 _floorPrice, uint256 _deadline) internal view returns (bytes32) {
    return
      keccak256(
        abi.encodePacked(
          "\x19\x01",
          _deriveDomainSeparator(),
          keccak256(abi.encode(FLOOR_TYPEHASH, _submitter, _floorPrice, _deadline))
        )
      );
  }

  /**
		Propose an escrow-based loan offer for this Vault's owner to consider. The
		signature is used to provide the collection floor price from a trusted
		oracle so as to determine a floor ownership percent.

		@param _share The percent of this Vault to acquire, in basis points.
		@param _offerDeadline The deadline by which the Vault owner must accept this
			offer.
    @param _dailyFee The daily fee to pay for the loan, in basis points.


		@custom:throws BadSignature if the signature submitted for setting 
			royalties is invalid.
		@custom:throws SignatureExpired if the signature is expired.
	*/
  function proposeLoan(
    uint256 _share,
    uint256 _offerDeadline,
    uint256 _dailyFee,
    uint256 _dailyLatePaymentInterest
  ) external payable nonReentrant {
    if (receiptId == 0) {
      revert MissingCollateral();
    }

    // Verify that the signature was signed by the validator.
    // if (_recover(_hash(msg.sender, _floorPrice, _deadline), _signature) != validator) {
    //   revert BadSignature();
    // }

    // Verify that the signature has not expired.
    // if (_deadline < block.timestamp) {
    //   revert SignatureExpired();
    // }

    // Verify that the offer does not exceed the asset floor price.
    uint256 _floorPrice = _getFloorPrice();
    if (msg.value > _floorPrice) {
      revert OfferExceedsFloor();
    }

    // Verify that the offer does not exceed the asset floor price.
    if (_share <= 0 || _share > availableEquity) {
      revert InvalidShare();
    }

    // Calculate the intended share based on message value and floor price.
    uint256 _equityPercentageXPriceMultiplier = (msg.value * MAX_EQUITY_SUPPLY) / _floorPrice;

    // Record this offer tagged to this address such that it might be canceled.
    offers[nextOfferId] = Offer({
      epXpm: _equityPercentageXPriceMultiplier,
      equity: _share,
      deadline: _offerDeadline,
      value: msg.value,
      proposer: msg.sender,
      status: 1,
      dailyFee: _dailyFee,
      dailyLPInterest: _dailyLatePaymentInterest
    });
    // callerOffers[msg.sender].push(nextOfferId);
    unchecked {
      nextOfferId += 1;
    }

    // Emit an event notifying about the loan offer.
    emit LoanProposed(msg.sender, _equityPercentageXPriceMultiplier, _share, _offerDeadline, nextOfferId);
  }

  function cancelProposal(uint256 _offerId) external nonReentrant {
    // Verify that cancelation is being attempted by the loan proposer.
    if (offers[_offerId].proposer != msg.sender && getCollateralOwner() != msg.sender) {
      revert CanOnlyCancelOwnProposal();
    }

    // Verify that the proposal has not already been accepted or canceled.
    if (offers[_offerId].status != 1) {
      revert CanOnlyCancelPendingProposal();
    }

    // Flag the offer as canceled.
    offers[_offerId].status = 2;

    /*
			Check each citizen ID to find its index and remove the token from the
			staked item array of its old position.
		*/
    // uint256[] storage oldPosition = callerOffers[msg.sender];
    // for (uint256 stakedIndex; stakedIndex < oldPosition.length; ) {
    //   // Remove the element at the matching index.
    //   if (_offerId == oldPosition[stakedIndex]) {
    //     if (stakedIndex != oldPosition.length - 1) {
    //       oldPosition[stakedIndex] = oldPosition[oldPosition.length - 1];
    //     }
    //     oldPosition.pop();
    //     break;
    //   }
    //   unchecked {
    //     stakedIndex++;
    //   }
    // }

    // Refund the escrow.
    (bool success, ) = offers[_offerId].proposer.call{value: offers[_offerId].value}("");
    if (!success) {
      revert InvalidTransfer();
    }

    // Emit event.
    emit ProposalCanceled(msg.sender, _offerId);
  }

  function acceptLoan(
    uint256 _offerId,
    uint256 acceptedShares
  ) external nonReentrant hasValidPermit(UNIVERSAL, LOAN_ACCEPT) {
    if (receiptId == 0) {
      revert MissingCollateral();
    }

    // Prevent accepting non-pending loan.
    if (offers[_offerId].status != 1) {
      revert CanOnlyAcceptPendingProposal();
    }

    // Update loan status
    offers[_offerId].status = 3;

    // Prevent overcollateralization of Vault.
    if (acceptedShares < 0 || acceptedShares > offers[_offerId].equity) {
      revert InvalidShare();
    }
    if (acceptedShares > availableEquity) {
      revert InvalidShare();
    }
    availableEquity -= acceptedShares;

    uint256 refundShares = offers[_offerId].equity - acceptedShares;
    uint256 refundPercent = refundShares / offers[_offerId].equity;
    uint256 refundAmount = refundPercent * offers[_offerId].value;
    if (refundAmount < 0 || refundAmount >= offers[_offerId].value) {
      revert InvalidShare();
    }
    offers[_offerId].value -= refundAmount;
    offers[_offerId].equity = acceptedShares;

    // Refund the escrow.
    {
      (bool success, ) = offers[_offerId].proposer.call{value: refundAmount}("");
      if (!success) {
        revert InvalidTransfer();
      }
    }

    {
      // Fund owner.
      (bool success, ) = msg.sender.call{value: offers[_offerId].value}("");
      if (!success) {
        revert InvalidTransfer();
      }
    }

    // Mint lien NFT.
    lienMinter.mint(offers[_offerId].proposer, _offerId, acceptedShares, "");

    // Emit event.
    emit LoanAccepted(_offerId, acceptedShares);
  }

  function _getFloorPrice() internal returns (uint256) {
    // TODO: Chainlink oracle
    return 1e18; // 1 ETH
    // return Oracle(oracle).getFloorPrice(collection);
  }

  function _getLiquidationPrice() internal view returns (uint256) {
    uint256 liens = 0;
    for (uint i = 0; i < nextOfferId; i++) {
      if (offers[i].status == 2) {
        uint256 A = (salePrice * offers[i].equity) / MAX_EQUITY_SUPPLY;
        uint256 B = (endPriceFloor * offers[i].equity) / MAX_EQUITY_SUPPLY;
        uint256 C = (endPriceFloor * offers[i].epXpm) / MAX_EQUITY_SUPPLY;
        liens += Math.max(A, Math.max(B, C));
      }
    }
    return liens;
  }

  function beginLiquidation(uint256 _salePrice) external payable nonReentrant hasValidPermit(UNIVERSAL, LIQUIDATE) {
    if (receiptId == 0) {
      revert MissingCollateral();
    }
    if (liquidationPayout != 0) {
      revert LiquidationAlredyStarted();
    }
    if (_salePrice < 0) {
      revert InvalidSalePrice();
    }

    salePrice = _salePrice;
    endPriceFloor = _getFloorPrice();
    liquidationPayout = _getLiquidationPrice();

    // Verify that the received amount is enough to pay all outstanding liens.
    if (msg.value < liquidationPayout) {
      revert InvalidTransfer();
    }

    // Refund overpayment.
    if (msg.value > liquidationPayout) {
      (bool success, ) = msg.sender.call{value: msg.value - liquidationPayout}("");
      if (!success) {
        revert InvalidTransfer();
      }
    }

    // TODO: accept any external caller to beginLiquidation when, either:
    // 1. Lien payments are in default and
    //    they deposited enough to pay all outstanding liens and
    //    they waited past the deadline
    // 2. Their bid to buy the collateral NFT
    //    - covers all outstanding liens and
    //    - is accepted by the receipt holder
  }

  // Claim function allowing a payer to claim the NFT in this Vault.
  function _returnColateral(address to) private nonReentrant {
    if (receiptId == 0) {
      revert MissingCollateral();
    }

    // Prevent returning collateral if there are liens.
    if (lienMinter.totalSupply() != 0 && liquidationPayout == 0) {
      revert InvalidTransfer();
    }

    // Burn receipt.
    receiptMinter.burn(receiptId);
    receiptId = 0;

    // Return collateral.
    IERC721(collection).safeTransferFrom(address(this), to, colateralId);
  }

  /**
   * @dev See {IERC721Receiver-onERC721Received}.
   *
   * Always returns `IERC721Receiver.onERC721Received.selector`.
   */
  function onERC721Received(
    address,
    address from,
    uint256 tokenId,
    bytes memory
  ) public virtual override returns (bytes4) {
    // Exchange receipt for collateral.
    if (msg.sender == address(receiptMinter)) {
      if (tokenId != receiptId) {
        revert InvalidTransfer();
      }

      // Prevent returning collateral if not actually received by this contract.
      if (receiptMinter.ownerOf(receiptId) != address(this)) {
        revert InvalidTransfer();
      }

      _returnColateral(from);
      return this.onERC721Received.selector;
    }

    // Deposit collateral.
    if (msg.sender == collection) {
      if (receiptId != 0) {
        // Only allow one collateral.
        revert InvalidTransfer();
      }

      // Prevent depositing the wrong collateral.
      if (tokenId != colateralId) {
        revert InvalidTransfer();
      }

      // Prevent depositing collateral if not actually received by this contract.
      if (IERC721(collection).ownerOf(colateralId) != address(this)) {
        revert InvalidTransfer();
      }

      // Mint receipt.
      availableEquity = MAX_EQUITY_SUPPLY;
      receiptId = receiptMinter.safeMint(from, receiptUri);

      return this.onERC721Received.selector;
    }

    revert InvalidTransfer();
  }

  function onERC1155Received(
    address,
    address from,
    uint256 tokenId,
    uint256 value,
    bytes memory
  ) public virtual override returns (bytes4) {
    // Allow Lien holders to burn their Liens to trigger a payout.
    if (msg.sender == address(lienMinter)) {
      if (offers[tokenId].status == 2) {
        // Burn received liens.
        lienMinter.burn(address(this), tokenId, value);

        if (lienMinter.totalSupply() == 0) {
          // No more liens, end liquidation.
          liquidationPayout = 0;
        }

        // Payout to lien holder.
        uint256 A = (salePrice * value) / MAX_EQUITY_SUPPLY;
        uint256 B = (endPriceFloor * value) / MAX_EQUITY_SUPPLY;
        uint256 C = ((((endPriceFloor * value) / offers[tokenId].equity) * offers[tokenId].epXpm)) / MAX_EQUITY_SUPPLY;
        uint256 payout = Math.max(A, Math.max(B, C));

        (bool success, ) = from.call{value: payout}("");
        if (!success) {
          revert InvalidTransfer();
        }
      }
      return this.onERC721Received.selector;
    }

    revert InvalidTransfer();
  }

  function onERC1155BatchReceived(
    address,
    address,
    uint256[] calldata,
    uint256[] calldata,
    bytes calldata
  ) public virtual returns (bytes4) {
    revert InvalidTransfer();
  }
}
