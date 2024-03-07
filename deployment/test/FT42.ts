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

	describe("Deployment", function() {
		it("deployer address should be owner by default", async function() {
			const { contract, owner } = await loadFixture(deployFT42Fixture);
			expect(await contract.owner()).to.equal(owner.address);
		});

		it("transferStatus should be enabled by default", async function() {
			const { contract } = await loadFixture(deployFT42Fixture);
			expect(await contract.transferStatus()).to.equal(true);
		});

		it("transferStatus should be disabled after switch", async function() {
			const { contract } = await loadFixture(deployFT42Fixture);
			await contract.switchTransferStatus();
			expect(await contract.transferStatus()).to.equal(false);
		});

		it("transferStatus should be enabled after switching twice", async function() {
			const { contract } = await loadFixture(deployFT42Fixture);
			await contract.switchTransferStatus();
			await contract.switchTransferStatus();
			expect(await contract.transferStatus()).to.equal(true);
		});

		it("transferStatus should not be switched by another account than owner", async function() {
			const { contract, account1 } = await loadFixture(deployFT42Fixture);
			await expect(contract.connect(account1).switchTransferStatus()).to.be.reverted;
		});

		it("transfer should be reverted", async function() {
			const { contract, account1 } = await loadFixture(deployFT42Fixture);
			await contract.switchTransferStatus();
			await expect(contract.transfer(account1, ethers.parseEther("1000"))).to.be.reverted;
		});

		it("transfer should not be reverted", async function() {
			const { contract, account1 } = await loadFixture(deployFT42Fixture);
			await contract.switchTransferStatus();
			await contract.switchTransferStatus();
			await expect(contract.transfer(account1, ethers.parseEther("1000"))).not.to.be.reverted;
		});
	});
});
