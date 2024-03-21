import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultisigModule = buildModule("MultisigModule", (m) => {
	const multisig = m.contract("Multisig", [
		m.getParameter("contractAddr"),
		m.getParameter("nbReqSignatures"),
		m.getParameter("signers")
	]);
	return { multisig };
});

export default MultisigModule;
