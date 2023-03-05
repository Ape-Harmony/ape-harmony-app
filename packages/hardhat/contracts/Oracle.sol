// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.9;

contract Oracle {
  /// Returns the floor price for a given NFT collection.
  function getFloorPrice(address collection) public returns (uint256) {
    return 1e18;
  }
}
