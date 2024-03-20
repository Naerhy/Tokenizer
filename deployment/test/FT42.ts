import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("FT42", function () {
	async function deployFT42Fixture() {
		const DECIMALS = 18;
		const amounts: { [key: string]: bigint } = {
			initial: hre.ethers.parseUnits("1000000", DECIMALS),
			s5000: hre.ethers.parseUnits("5000", DECIMALS),
			s1000: hre.ethers.parseUnits("1000", DECIMALS),
			s500: hre.ethers.parseUnits("500", DECIMALS),
			s100: hre.ethers.parseUnits("100", DECIMALS),
			s50: hre.ethers.parseUnits("50", DECIMALS)
		};
		const [owner, account1, account2] = await hre.ethers.getSigners();
		const contract = await hre.ethers.deployContract("FT42", [amounts.initial]);
		await contract.transfer(account1, amounts.s1000);
		await contract.transfer(account2, amounts.s500);
		return { contract, owner, account1, account2, amounts };
	}

	describe("ERC20", function () {
		it("owner", async function () {
			const { contract, owner } = await loadFixture(deployFT42Fixture);
			expect(await contract.owner()).to.equal(owner.address);
		});

		it("transferStatus", async function () {
			const { contract, account1 } = await loadFixture(deployFT42Fixture);
			expect(await contract.transferStatus()).to.equal(true);
			await contract.switchTransferStatus();
			expect(await contract.transferStatus()).to.equal(false);
			await contract.switchTransferStatus();
			expect(await contract.transferStatus()).to.equal(true);
			await expect(contract.connect(account1).switchTransferStatus()).to.be.reverted;
		});

		it("transfer", async function () {
			const { contract, owner, account1, account2, amounts } = await loadFixture(deployFT42Fixture);
			expect(await contract.balanceOf(owner)).to.equal(amounts.initial - amounts.s1000 - amounts.s500);
			expect(await contract.balanceOf(account1)).to.equal(amounts.s1000);
			expect(await contract.balanceOf(account2)).to.equal(amounts.s500);
			await contract.transfer(account1, amounts.s100);
			await contract.transfer(account2, amounts.s50);
			expect(await contract.balanceOf(account1)).to.equal(amounts.s1000 + amounts.s100);
			expect(await contract.balanceOf(account2)).to.equal(amounts.s500 + amounts.s50);
			await contract.switchTransferStatus();
			await expect(contract.transfer(account1, amounts.s1000)).to.be.reverted;
		});
	});

	describe("FT42", function () {
		it("duels", async function () {
			const { contract, account1, account2, amounts } = await loadFixture(deployFT42Fixture);
			await expect(contract.connect(account1).createDuel(account2.address, amounts.s5000)).to.be.reverted;
			await contract.connect(account1).createDuel(account2.address, amounts.s100);
			const [bid, depositedAmount, winner, status] = await contract.duels(0);
			expect(await contract.balanceOf(account1.address)).to.be.equal(amounts.s1000 - amounts.s100);
			expect(bid).to.equal(amounts.s100);
			expect(depositedAmount).to.equal(amounts.s100);
			expect(winner).to.equal(hre.ethers.ZeroAddress);
			expect(status).to.equal(0);
			await expect(contract.duels(3)).to.be.reverted;
		});

		it("acceptDuel", async function () {
			const { contract, account1, account2, amounts } = await loadFixture(deployFT42Fixture);
			await contract.connect(account1).createDuel(account2.address, amounts.s100);
			await expect(contract.acceptDuel(3)).to.be.reverted;
			await expect(contract.acceptDuel(0)).to.be.reverted;
			await expect(contract.connect(account1).acceptDuel(0)).to.be.reverted;
			await contract.connect(account2).acceptDuel(0);
			const status = (await contract.duels(0))[3];
			expect(status).to.be.equal(1);
			await expect(contract.connect(account2).acceptDuel(0)).to.be.reverted;
			expect(await contract.balanceOf(account2)).to.be.equal(amounts.s500 - amounts.s100);
		});

		it("startDuel", async function () {
			const { contract, account1, account2, amounts } = await loadFixture(deployFT42Fixture);
			await contract.connect(account1).createDuel(account2.address, amounts.s100);
			await contract.connect(account2).acceptDuel(0);
			await contract.connect(account1).startDuel(0);
			const winner = (await contract.duels(0))[2];
			const status = (await contract.duels(0))[3];
			expect(winner).to.satisfy(function (address: string) {
				if (address === account1.address || address === account2.address) {
					return true;
				}
				return false;
			});
			expect(status).to.be.equal(2);
			if (winner === account1.address) {
				expect(await contract.balanceOf(account1.address)).to.be.equal(amounts.s1000 + amounts.s100);
			} else {
				expect(await contract.balanceOf(account2.address)).to.be.equal(amounts.s500 + amounts.s100);
			}
			await expect(contract.connect(account1).startDuel(0)).to.be.reverted;
		});

		it("cancelDuels", async function () {
			const { contract, account1, account2, amounts } = await loadFixture(deployFT42Fixture);
			await contract.connect(account1).createDuel(account2.address, amounts.s100);
			await expect(contract.cancelDuel(0)).to.be.reverted;
			await contract.connect(account1).cancelDuel(0);
			const status = (await contract.duels(0))[3];
			expect(status).to.be.equal(3);
			await expect(contract.connect(account1).cancelDuel(0)).to.be.reverted;
		});
	});
});
