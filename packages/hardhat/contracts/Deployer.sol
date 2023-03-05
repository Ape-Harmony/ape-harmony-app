// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import {Vault} from "./vault/Vault.sol";
import {LienNft} from "./LienNft.sol";
import {VaultReceiptNft} from "./VaultReceiptNft.sol";
import {Oracle} from "./Oracle.sol";

contract Deployer is Ownable {
  // Mapping from collection address to tokenId to vault address
  mapping(address => mapping(uint256 => Vault)) public vaultByCollectionAndTokenId;

  mapping(address => Vault[]) public vaultsByCollection;

  address[] private _approvedUsers;

  address[] private _approvedCollections;

  Oracle private _oracle;

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

  // TODO: Restrict to only owner
  function setOracle(Oracle oracle) public {
    _oracle = oracle;
  }

  // TODO: Restrict to only owner
  function approveCollection(address collection) public {
    for (uint i = 0; i < _approvedCollections.length; i++) {
      if (_approvedCollections[i] == collection) {
        revert("Collection already approved");
      }
    }
    _approvedCollections.push(collection);
  }

  // TODO: Restrict to only owner
  function approveUser(address user) public {
    for (uint i = 0; i < _approvedUsers.length; i++) {
      if (_approvedUsers[i] == user) {
        revert("User already approved");
      }
    }
    _approvedUsers.push(user);
  }

  function deployVault(LienNft lienMinter, address collection, uint256 tokenId, string memory receiptUri) public {
    if (_oracle == Oracle(address(0))) {
      revert("Oracle not set");
    }

    if (vaultByCollectionAndTokenId[collection][tokenId] != Vault(address(0))) {
      revert("Vault already exists");
    }

    // TODO: Use proxy pattern to deploy LienNft and Vault
    Vault vault = new Vault(_oracle, _receiptMinter, lienMinter, collection, tokenId, receiptUri);
    vault.transferOwnership(owner());

    vaultByCollectionAndTokenId[collection][tokenId] = vault;
    vaultsByCollection[collection].push(vault);
  }
}
