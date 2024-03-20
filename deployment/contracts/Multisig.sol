// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Multisig {
	struct Transaction {
		bytes data;
		uint256 nbSignatures;
		bool executed;
	}

	address public immutable contractAddr;
	address[] public signers;
	mapping(address => bool) public isSigner;
	uint256 public immutable nbReqSignatures;
	Transaction[] public transactions;
	mapping(uint256 => mapping(address => bool)) public transactionsSignatures;

	event SubmitTransaction(uint256 indexed id, address indexed caller);
	event ConfirmTransaction(uint256 indexed id, address indexed caller);
	event RevokeTransaction(uint256 indexed id, address indexed caller);
	event ExecuteTransaction(uint256 indexed id);

	constructor(address _contractAddr, uint256 _nbReqSignatures, address[] memory _signers) {
		require(_nbReqSignatures > 2, "require more than 2 signers");
		require(_signers.length >= _nbReqSignatures, "not enough signers");
		contractAddr = _contractAddr;
		for (uint256 i = 0; i < _signers.length; i++) {
			require(_signers[i] != address(0), "signer cannot be zero address");
			require(!isSigner[_signers[i]], "duplicated signers");
			signers.push(_signers[i]);
			isSigner[_signers[i]] = true;
		}
		nbReqSignatures = _nbReqSignatures;
	}

	modifier onlySigner() {
		require(isSigner[msg.sender], "you are not a signer");
		_;
	}

	modifier existingTransaction(uint256 id) {
		require(id < transactions.length, "transaction does not exist");
		_;
	}

	modifier notExecuted(uint256 id) {
		require(!transactions[id].executed, "transaction has been executed");
		_;
	}

	receive() external payable {}

	fallback() external payable {}

	function getBalance() public view returns (uint256) {
		return address(this).balance;
	}

	function submitTransaction(bytes calldata _data) public onlySigner returns (uint256) {
		transactions.push(Transaction(_data, 0, false));
		emit SubmitTransaction(transactions.length - 1, msg.sender);
		return transactions.length - 1;
	}

	function confirmTransaction(uint256 id) public onlySigner existingTransaction(id) notExecuted(id) {
		require(!transactionsSignatures[id][msg.sender], "you have already signed the transaction");
		Transaction storage transaction = transactions[id];
		transaction.nbSignatures++;
		transactionsSignatures[id][msg.sender] = true;
		emit ConfirmTransaction(id, msg.sender);
	}

	function revokeTransaction(uint256 id) public onlySigner existingTransaction(id) notExecuted(id) {
		require(transactionsSignatures[id][msg.sender], "you have not yet confirmed this transaction");
		Transaction storage transaction = transactions[id];
		transaction.nbSignatures--;
		transactionsSignatures[id][msg.sender] = false;
		emit RevokeTransaction(id, msg.sender);
	}

	function executeTransaction(uint256 id) public onlySigner existingTransaction(id) notExecuted(id) {
		Transaction storage transaction = transactions[id];
		require(transaction.nbSignatures >= nbReqSignatures, "transaction requires additional signers");
		(bool success,) = contractAddr.call(transaction.data);
		require(success, "transaction failed");
		transaction.executed = true;
		emit ExecuteTransaction(id);
	}

	function transactionsCount() public view returns (uint256) {
		return transactions.length;
	}
}
