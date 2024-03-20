import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Multisig", function () {
	async function deployMultisigFixture() {
		const [owner, account1, account2, account3] = await hre.ethers.getSigners();
		const ft42 = await hre.ethers.deployContract("FT42", [hre.ethers.parseUnits("1000000", 18)]);
		const multisig = await hre.ethers.deployContract("Multisig", [await ft42.getAddress(), 3, [account1.address, account2.address, account3.address]]);
		return { ft42, multisig, owner, account1, account2, account3 };
	}

	it("transferOwnership from multisig", async function () {
		const { ft42, multisig, account1, account2, account3 } = await loadFixture(deployMultisigFixture);
		await ft42.transferOwnership(await multisig.getAddress());
		expect(await ft42.owner()).to.equal(await multisig.getAddress());
		const _interface = new hre.ethers.Interface(["function switchTransferStatus()"]);
		await multisig.connect(account1).submitTransaction(_interface.encodeFunctionData("switchTransferStatus"));
		for (const acc of [account1, account2, account3]) {
			await multisig.connect(acc).confirmTransaction(0);
		}
		await multisig.connect(account1).executeTransaction(0);
		expect(await ft42.transferStatus()).to.equal(false);
		await expect(ft42.transfer(account1.address, hre.ethers.parseUnits("100", 18))).to.be.reverted;
	});
});
