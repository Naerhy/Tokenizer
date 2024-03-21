import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";

const FT42Module = buildModule("FT42Module", (m) => {
	const ft42 = m.contract("FT42", [hre.ethers.parseEther("1000000")]);
	return { ft42 };
});

export default FT42Module;
