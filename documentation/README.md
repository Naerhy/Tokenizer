# Documentation

## FT42

In addition to complying with the ERC20 standard thanks to the OpenZeppelin contracts ([API](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20)), the FT42 smart contract adds 2 new features:
- it implements a duel system where users can challenge each others in order to possibly win the opponent's tokens in play (winner is randomly picked)
- the owner of the contract has the option to toggle on and off the tokens transfers

## Multisig

This smart contract is a bit more complex as it involves interacting with another contract and encoding functions calls to data bytes passed as argument. You can only call functions from the FT42 contract you have submitted in the constructor, and the multisig contract has to be given ownership of it. Then the signers will be able to submit transactions with data bytes corresponding to functions calls available on FT42. If enough signers have confirmed the transactions, it can be executed.

## Usage

```bash
# download and install the required packages
git clone https://github.com/Naerhy/Tokenizer.git
cd Tokenizer/deployment
npm install

# compile the contracts
npm run compile

# run the tests
npm run test

# set mandatory configuration variables
npx hardhat vars set ALCHEMY_API_KEY
npx hardhat vars set PRIVATE_KEY
npx hardhat vars set BASESCAN_API_KEY

# deploy the contracts
npx hardhat ignition deploy ignition/modules/FT42.ts --network base-sepolia --deployment-id base-sepolia-ft42
# you will have to replace the values in ignition/parameters.json after the deployment of the first contract
npx hardhat ignition deploy ignition/modules/Multisig.ts --network base-sepolia --deployment-id base-sepolia-multisig

# verify the contracts
npx hardhat ignition verify --network base-sepolia base-sepolia-ft42
npx hardhat ignition verify --network base-sepolia base-sepolia-multisig
```

Once the smart contracts have been deployed and verified, you can interact directly with them on [BaseScan](https://sepolia.basescan.org/), or create your own scripts with the help of Web3 libraries (web3js, Ethers, Brownie, ...).
