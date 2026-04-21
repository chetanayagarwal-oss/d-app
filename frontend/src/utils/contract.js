import { ethers } from 'ethers';
import SentinelPayArtifact from './SentinelPay.json';

// In a real dApp, this address would come from .env or config post-deployment.
// We provide a fallback just so the app doesn't crash before deployment.
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CONTRACT_ABI = SentinelPayArtifact.abi;

export const getProvider = () => {
    if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error('MetaMask is not installed');
};

export const getContractWithSigner = async () => {
    const provider = getProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getContractWithProvider = () => {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
