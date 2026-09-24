import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './utils/contract';
import { initNeuralCanvas } from './utils/motion';

import ConnectWallet from './components/ConnectWallet';
import OwnerDashboard from './components/OwnerDashboard';
import AgentSimulator from './components/AgentSimulator';
import TransactionLog from './components/TransactionLog';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);

  // Boot neural network canvas
  useEffect(() => {
    const cleanup = initNeuralCanvas();
    return cleanup;
  }, []);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleChange = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : '');
    };
    window.ethereum.on('accountsChanged', handleChange);
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => { if (accounts.length > 0) setAccount(accounts[0]); })
      .catch(console.error);
    return () => window.ethereum.removeListener('accountsChanged', handleChange);
  }, []);

  // Fetch balance + owner check
  useEffect(() => {
    if (!account) { setBalance('0'); setIsOwner(false); return; }
    const fetchDetails = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(account);
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const owner = await contract.owner();
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch {
          setIsOwner(false);
        }
      } catch (err) {
        console.error('fetchDetails error:', err);
      }
    };
    fetchDetails();
  }, [account]);

  return (
    <>
      {/* AI neural background layers */}
      <div className="hex-grid" />

      {/* Navbar + Hero */}
      <ConnectWallet
        account={account}
        setAccount={setAccount}
        balance={balance}
        isOwner={isOwner}
      />

      {account && (
        <main className="container">
          {isOwner && <OwnerDashboard account={account} />}
          <div className="dashboard-grid">
            <AgentSimulator account={account} />
            <TransactionLog />
          </div>
        </main>
      )}

      <footer className="footer">
        ⬡ SENTINELPAY · AI NEURAL PAYMENT SECURITY · ETHEREUM
      </footer>
    </>
  );
}

export default App;
