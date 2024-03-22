# Tokenizer

Creation of a token on an EVM-compatible blockchain.

## Description

Tokenizer is a project which highlights the creation of a token called FT42 (name of choice) on an EVM-compatible blockchain in order to discover and better understand the functioning of blockchains, the Ethereum protocol, smart contracts and Web3 in general.

At the start of the project, I had to decide which development platform to use to code and deploy the FT42 token. Several choices were available depending on the programming language used. Having knowledge of TypeScript, I therefore chose [Hardhat](https://hardhat.org), which provides several components for compiling, testing and deploying smart contracts.

In order to meet the requirements of the ERC20 standard, the FT42 token inherits from the smart contracts developed by [OpenZeppelin](https://docs.openzeppelin.com/contracts/5.x). Therefore, we can be certain to interact with the tokens of this project as we would with other tokens complying with the same standards.  
The smart contract also include the option to toggle transfers on and off, and implements a duel system where users can gamble their tokens against other accounts.

Once the smart contract had been written and tested, I had to decide on which EVM-compatible blockchain to deploy it. Originally intented to be deployed on Ethereum Sepolia, I had to look for an alternative blockchain with lower transaction fees as I didn't have enough ETH to deploy the second smart contract (from the bonus). So I chose the new L2 testnet blockchain developed by Coinbase: Base Sepolia.

Finally, in order to interact in my scripts with the blockchain and query information about it, I had to get an [Alchemy](https://www.alchemy.com) API key. Another API key was also required to verify the source code of the smart contracts on [BaseScan](https://sepolia.basescan.org).

To learn more about the deployment steps of this project, refer to this [documentation](documentation/README.md).

## Bonus

As requested by the subject, the bonus requires the development of a multisig smart contract. This type of contract adds a layer of security as any transaction submitted by it must be validated by multiple accounts. It makes compromising transactions from a single account impossible.

## Addresses of deployed smart contracts

- FT42: 0xBd7218cA598C5bdB89B2375b5df43F805b56E39F
- Multisig: 0x6A753256E1C5374D5885A19cD87e7f7439076119
