import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const BASESCAN_API_KEY = vars.get("BASESCAN_API_KEY");

const config: HardhatUserConfig = {
	solidity: "0.8.24",
	networks: {
		"base-sepolia": {
			url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
			accounts: [PRIVATE_KEY]
		}
	},
	etherscan: {
		apiKey: {
			"base-sepolia": BASESCAN_API_KEY
		},
		customChains: [
			{
				network: "base-sepolia",
				chainId: 84532,
				urls: {
					apiURL: "https://api-sepolia.basescan.org/api",
					browserURL: "https://sepolia.basescan.org"
				}
			}
		]
	}
};

export default config;
