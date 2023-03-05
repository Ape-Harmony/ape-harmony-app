// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

import {Vault} from "./vault/Vault.sol";
import {LienNft} from "./LienNft.sol";
import {VaultReceiptNft} from "./VaultReceiptNft.sol";

contract Deployer {
  // Mapping from collection address to tokenId to vault address
  mapping(address => mapping(uint256 => Vault)) public vaultByCollectionAndTokenId;

  mapping(address => Vault[]) public vaultsByCollection;

  address[] private _approvedUsers;

  address[] private _approvedCollections;

  address private _oracle;

  VaultReceiptNft private _receiptMinter;

  constructor(VaultReceiptNft receiptMinter) {
    _receiptMinter = receiptMinter;
  }

  function getApprovedUsers() public view returns (address[] memory) {
    return _approvedUsers;
  }

  function getApprovedCollections() public view returns (address[] memory) {
    return _approvedCollections;
  }

  function setOracle(address oracle) public {
    _oracle = oracle;
  }

  function approveCollection(address collection) public {
    for (uint i = 0; i < _approvedCollections.length; i++) {
      if (_approvedCollections[i] == collection) {
        revert("Collection already approved");
      }
    }
    _approvedCollections.push(collection);
  }

  function approveUser(address user) public {
    for (uint i = 0; i < _approvedUsers.length; i++) {
      if (_approvedUsers[i] == user) {
        revert("User already approved");
      }
    }
    _approvedUsers.push(user);
  }

  function deployVault(LienNft lienMinter, address collection, uint256 tokenId, string memory receiptUri) public {
    if (_oracle == address(0)) {
      revert("Oracle not set");
    }

    if (vaultByCollectionAndTokenId[collection][tokenId] != Vault(address(0))) {
      revert("Vault already exists");
    }

    // TODO: Use proxy pattern to deploy LienNft and Vault
    Vault vault = new Vault(_oracle, _receiptMinter, lienMinter, collection, tokenId, receiptUri);

    vaultByCollectionAndTokenId[collection][tokenId] = vault;
    vaultsByCollection[collection].push(vault);
  }
}
