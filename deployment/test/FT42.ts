import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("FT42", function () {
	async function deployFT42Fixture() {
		const INITIAL_SUPPLY = 10000000;
		const [owner, account1, account2] = await ethers.getSigners();

		const factory = await ethers.getContractFactory("FT42");
		const contract = await factory.deploy(ethers.parseEther(INITIAL_SUPPLY.toString()));

		return { contract, owner, account1, account2 };
	}

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			const { contract, owner } = await loadFixture(deployFT42Fixture);

			expect(await contract.owner()).to.equal(owner.address);
		});
	});
});
