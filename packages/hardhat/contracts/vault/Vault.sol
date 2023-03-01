// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {PermitControl} from "./access/PermitControl.sol";
import {EIP712} from "./libraries/EIP712.sol";
import {LienNft} from "../LienNft.sol";

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

/**
	@custom:benediction DEVS BENEDICAT ET PROTEGAT CONTRACTVS MEAM
	@title A contract to support fractionalized lending for an NFT.
	@author Tim Clancy <tim-clancy.eth>

	This contract allows an NFT holder to retain ownership of their item while 
	negotiating loans against it.

	@custom:date February 26th, 2023.
*/
contract Vault is EIP712, PermitControl, ReentrancyGuard {
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

  /// The address of the off-chain validator signer.
  address public validator;

  /// The address of the receipt emmiter contract.
  address public receiptMinter;

  /// The address of the lien emmiter contract.
  address public lienMinter;

  /// An ID for the next offer to create.
  uint256 public nextOfferId;

  /// The total number of unminted shares in the Vault.
  uint256 public availableShares = 100 * 100;

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
    uint256 intent;
    uint256 share;
    uint256 deadline;
    uint256 value;
    address proposer;
    uint256 status;
  }

  /// Store each Offer against its ID.
  mapping(uint256 => Offer) public offers;

  /// A mapping correlating an address to each of its offers.
  mapping(address => uint[]) public callerOffers;

  /// A mapping correlating an address to each of its locked NFTs.
  mapping(address => address[]) public callerVaults;

  /// A mapping correlating a locked NFT to each of its offers.
  mapping(address => uint256[]) public vaultOffers;

  /**
		This event is emitted whenever a loan is proposed.

		@param proposer The address which has proposed a loan offer on this Vault.
    @param intent The intended percent of ownership to pay for at which `share`
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

		@param offerId The ID of the canceled offer.
	*/
  event ProposalCanceled(uint256 offerId);

  /**
		Construct a new instance of this TODO.

		@param _validator The address to use as the validator signer.
    @param _receiptMinter The address of the receipt minter contract.
    @param _lienMinter The address of the lien minter contract.
	*/
  constructor(address _validator, address _receiptMinter, address _lienMinter) {
    validator = _validator;
    receiptMinter = _receiptMinter;
    lienMinter = _lienMinter;
  }

  /**
		Return the list of `_caller`'s proposed loan offer IDs.

		@param _caller The address of the loan offerer to retrieve offers from.

		@return _ The list of offers IDs of a particular caller `_caller`.
	*/
  function getCallerOffers(address _caller) external view returns (uint256[] memory) {
    return callerOffers[_caller];
  }

  /**
		Return the list of `_caller`'s proposed loan offer IDs.

		@param _caller The address of the loan offerer to retrieve offers from.

		@return _ The list of offers IDs of a particular caller `_caller`.
	*/
  function getCallerVaults(address _caller) external view returns (address[] memory) {
    return callerVaults[_caller];
  }

  /**
		Return the list of `_vault`'s proposed loan offer IDs.

		@param _vault The address of the loan offerer to retrieve offers from.

		@return _ The list of offers IDs for a `_vault`.
	*/
  function getVaultOffers(address _vault) external view returns (uint256[] memory) {
    return vaultOffers[_vault];
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
		@param _floorPrice The floor price in wei (Ether) of the asset collection of
			this Vault.
		@param _deadline The time until which the `_signature` is valid.
		@param _signature A signature signed by the `validator`.

		@custom:throws BadSignature if the signature submitted for setting 
			royalties is invalid.
		@custom:throws SignatureExpired if the signature is expired.
	*/
  function proposeLoan(
    uint256 _share,
    uint256 _offerDeadline,
    uint256 _floorPrice,
    uint256 _deadline,
    bytes calldata _signature
  ) external payable nonReentrant {
    // Verify that the signature was signed by the validator.
    if (_recover(_hash(msg.sender, _floorPrice, _deadline), _signature) != validator) {
      revert BadSignature();
    }

    // Verify that the signature has not expired.
    if (_deadline < block.timestamp) {
      revert SignatureExpired();
    }

    // Verify that the offer does not exceed the asset floor price.
    if (msg.value > _floorPrice) {
      revert OfferExceedsFloor();
    }

    // Verify that the offer does not exceed the asset floor price.
    if (_share < 0 || _share > availableShares) {
      revert InvalidShare();
    }

    // Calculate the intended share based on message value and floor price.
    uint256 intent = (msg.value * 100 * 100) / _floorPrice;

    // Record this offer tagged to this address such that it might be canceled.
    offers[nextOfferId] = Offer({
      intent: intent,
      share: _share,
      deadline: _offerDeadline,
      value: msg.value,
      proposer: msg.sender,
      status: 1
    });
    callerOffers[msg.sender].push(nextOfferId);
    unchecked {
      nextOfferId += 1;
    }

    // Emit an event notifying about the loan offer.
    emit LoanProposed(msg.sender, intent, _share, _offerDeadline, nextOfferId);
  }

  /**
		TODO
	*/
  function cancelProposal(uint256 _offerId) external nonReentrant {
    // Verify that cancelation is being attempted by the loan proposer.
    if (offers[_offerId].proposer != msg.sender) {
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
    uint256[] storage oldPosition = callerOffers[msg.sender];
    for (uint256 stakedIndex; stakedIndex < oldPosition.length; ) {
      // Remove the element at the matching index.
      if (_offerId == oldPosition[stakedIndex]) {
        if (stakedIndex != oldPosition.length - 1) {
          oldPosition[stakedIndex] = oldPosition[oldPosition.length - 1];
        }
        oldPosition.pop();
        break;
      }
      unchecked {
        stakedIndex++;
      }
    }

    // Refund the escrow.
    (bool success, ) = msg.sender.call{value: offers[_offerId].value}("");

    // Emit event.
    emit ProposalCanceled(_offerId);
  }

  /**
		TODO
	*/
  function acceptLoan(uint256 _offerId, uint256 shares) external nonReentrant hasValidPermit(UNIVERSAL, LOAN_ACCEPT) {
    // Prevent accepting non-pending loan.
    if (offers[_offerId].status != 1) {
      revert CanOnlyAcceptPendingProposal();
    }

    // TODO: update loan status
    offers[_offerId].status = 3;

    // TODO: fund owner

    // TODO: Prevent overcollateralization of Vault.
    if (shares < 0 || shares > offers[_offerId].share) {
      revert InvalidShare();
    }
    if (shares > availableShares) {
      revert InvalidShare();
    }
    availableShares -= shares;

    // TODO: Mint lien NFT.
    LienNft(lienMinter).mint(msg.sender, _offerId, offers[_offerId].share, "");

    // TODO: Emit event.
    emit LoanAccepted(_offerId, shares);
  }

  /**
		TODO
	*/
  function beginLiquidation(uint256 _price) external nonReentrant hasValidPermit(UNIVERSAL, LIQUIDATE) {
    // TODO: _price cannot be less than loan principals.
    // TODO: accept any external caller to call `claim` to pay for NFT.
  }

  // TODO: claim function allowing a payer to claim the NFT in this Vault.

  // TODO: function allowing Lien holders to burn their Liens for their shares.
}
