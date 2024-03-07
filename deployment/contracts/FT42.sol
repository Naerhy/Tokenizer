// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract FT42 is ERC20, Ownable {
	bool public transferStatus = true;

	constructor(uint256 initialSupply) ERC20("FT42", "FT42") Ownable(_msgSender()) {
		_mint(msg.sender, initialSupply);
	}

	function switchTransferStatus() public onlyOwner {
		transferStatus = !transferStatus;
	}

	function transfer(address to, uint256 value) public override returns (bool) {
		require(transferStatus, "transfer is disabled");
		return super.transfer(to, value);
	}

	function transferFrom(address from, address to, uint256 value) public override returns (bool) {
		require(transferStatus, "transfer is disabled");
		return super.transferFrom(from, to, value);
	}
}
