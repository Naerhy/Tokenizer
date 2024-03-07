// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract FT42 is ERC20, Ownable {
	constructor(uint256 initialSupply) ERC20("FT42", "FT42") Ownable(_msgSender()) {
		_mint(msg.sender, initialSupply);
	}
}
