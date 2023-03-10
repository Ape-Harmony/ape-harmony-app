// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract LienNft is ERC1155, Ownable, ERC1155Burnable {
  constructor() ERC1155("https://TODO") {}

  // TODO: Restrict to only vault contract.
  function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
    _mint(account, id, amount, data);
  }

  function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
    _mintBatch(to, ids, amounts, data);
  }

  uint256 public totalSupply;

  /**
   * @dev See {ERC1155-_beforeTokenTransfer}.
   */
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

    if (from == address(0)) {
      for (uint256 i = 0; i < ids.length; ++i) {
        totalSupply += amounts[i];
      }
    }

    if (to == address(0)) {
      for (uint256 i = 0; i < ids.length; ++i) {
        uint256 amount = amounts[i];
        require(totalSupply >= amount, "ERC1155: burn amount exceeds totalSupply");
        unchecked {
          totalSupply -= amount;
        }
      }
    }
  }
}
