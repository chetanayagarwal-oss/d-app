import { ethers } from 'ethers';
import SentinelPayArtifact from './SentinelPay.json';

// ⚠️ Replace this with your deployed contract address after running:
//    npx hardhat run scripts/deploy.js --network sepolia
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CONTRACT_ABI = SentinelPayArtifact.abi;

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    let eth = window.ethereum;
    if (Array.isArray(window.ethereum.providers) && window.ethereum.providers.length > 0) {
      eth = window.ethereum.providers.find((p) => p.isMetaMask) ?? window.ethereum;
    }
    return new ethers.BrowserProvider(eth);
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
