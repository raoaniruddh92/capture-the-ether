import { Challenges1abi as abi, Challenges1bytecode as bytecode } from "../abi";
import { BrowserProvider } from "ethers";
const { ethers } = require("ethers");

export async function  interact(address){
    if (!window.ethereum) {
        throw new Error("MetaMask or other Ethereum provider not found.");
    }
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); 
    const signer = await provider.getSigner();  
    const contract = new ethers.Contract(address, abi, signer);    
    const result = await contract.isComplete();
    if (result==true){
        return true;
    }else{
        return false;
    }
}