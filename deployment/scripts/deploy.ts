import { ethers } from "hardhat";

async function main(): Promise<void> {
	try {
		const initialSupply = 10000000;
		const contract = await ethers.deployContract("FT42", [ethers.parseEther(initialSupply.toString())]);

		await contract.waitForDeployment();

		console.log(
			`Contract deployed with initial supply of ${ethers.parseEther(initialSupply.toString())}FT42 at address: ${contract.target}`
		);
	} catch (error: unknown) {
		console.error(error);
		process.exitCode = 1;
	}
}

main();
