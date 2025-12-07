import { Challenges4abi as abi, Challenges4bytecode as bytecode } from "../abi";
import { BrowserProvider, ContractFactory } from "ethers";

export async function deploy_contract() {
    if (!window.ethereum) {
        throw new Error("MetaMask or other Ethereum provider not found.");
    }
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); 
    const signer = await provider.getSigner();  

    const factory = new ContractFactory(abi, bytecode, signer);
    console.log("Attempting to deploy contract...");
    
    const contract = await factory.deploy();
    
    console.log("Deployment transaction sent. Waiting for confirmation...");
    const deploymentReceipt = await contract.waitForDeployment();   
    
    console.log("✅ Contract deployed successfully!");
    const address = await contract.getAddress();
    console.log("Contract Address:", address);
    console.log(deploymentReceipt);
    const tx = contract.deploymentTransaction();
    console.log(tx);
    localStorage.setItem(address,"current_challenge");
    return address;
}