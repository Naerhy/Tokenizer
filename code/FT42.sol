// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract FT42 is ERC20, Ownable {
	enum Status {
		PENDING,
		READY,
		DONE,
		CANCELLED
	}

	struct Duel {
		address[2] opponents;
		uint256 bid;
		uint256 depositedAmount;
		address winner;
		Status status;
	}

	bool public transferStatus;
	Duel[] public duels;

	event DuelCreated(uint256 indexed id);
	event DuelEnded(uint256 indexed id, address winner);

	constructor(uint256 initialSupply) ERC20("FT42", "FT42") Ownable(_msgSender()) {
		_mint(_msgSender(), initialSupply);
		transferStatus = true;
	}

	modifier validId(uint256 id) {
		require(id < duels.length, "not valid id");
		_;
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

	function opponents(uint256 id) public view returns (address[2] memory) {
		return duels[id].opponents;
	}

	function createDuel(address opponent, uint256 bid) public returns (uint256) {
		require(opponent != _msgSender(), "you cannot set yourself as opponent");
		uint256 duelId = duels.length;
		duels.push(
			Duel({
				opponents: [_msgSender(), opponent],
				bid: bid,
				depositedAmount: bid,
				winner: address(0),
				status: Status.PENDING
			})
		);
		transfer(address(this), bid);
		emit DuelCreated(duelId);
		return duelId;
	}

	function acceptDuel(uint256 id) public validId(id) {
		Duel storage duel = duels[id];
		if (_msgSender() != duel.opponents[1] || duel.status != Status.PENDING) {
			revert("you cannot interact with this duel");
		}
		transfer(address(this), duel.bid);
		duel.depositedAmount += duel.bid;
		duel.status = Status.READY;
	}

	function startDuel(uint256 id) public validId(id) returns (address) {
		Duel storage duel = duels[id];
		if ((_msgSender() != duel.opponents[0] && _msgSender() != duel.opponents[1]) || duel.status != Status.READY) {
			revert("you cannot start this duel");
		}
		uint256 rand = generateRandomNumber() % 2;
		address winner = duel.opponents[rand];
		duel.winner = winner;
		_transfer(address(this), winner, duel.depositedAmount);
		duel.status = Status.DONE;
		emit DuelEnded(id, winner);
		return winner;
	}

	function cancelDuel(uint256 id) public validId(id) {
		Duel storage duel = duels[id];
		if (_msgSender() != duel.opponents[0] || duel.status != Status.PENDING) {
			revert("you cannot interact with this duel");
		}
		_transfer(address(this), _msgSender(), duel.depositedAmount);
		duel.status = Status.CANCELLED;
	}

	function duelsCount() public view returns (uint256) {
		return duels.length;
	}

	function generateRandomNumber() private view returns (uint256) {
		return uint256(keccak256(abi.encodePacked(tx.origin, blockhash(block.number - 1), block.timestamp)));
	}
}
