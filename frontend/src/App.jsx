import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, getProvider } from './utils/contract';
import { initNeuralCanvas } from './utils/motion';

import ConnectWallet from './components/ConnectWallet';
import OwnerDashboard from './components/OwnerDashboard';
import AgentSimulator from './components/AgentSimulator';
import TransactionLog from './components/TransactionLog';

// Helper: reject after ms
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('—');
  const [isOwner, setIsOwner] = useState(false);
  const fetchRef = useRef(null); // cancel stale fetches on account change

  // Boot neural network canvas once
  useEffect(() => {
    let cleanup;
    try { cleanup = initNeuralCanvas(); } catch (e) { console.warn(e); }
    return () => { if (cleanup) cleanup(); };
  }, []);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleChange = (accounts) =>
      setAccount(accounts.length > 0 ? accounts[0] : '');
    window.ethereum.on('accountsChanged', handleChange);
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => { if (accounts.length > 0) setAccount(accounts[0]); })
      .catch(() => {});
    return () => window.ethereum.removeListener('accountsChanged', handleChange);
  }, []);

  // Fetch balance + owner in the BACKGROUND — never blocks the UI
  useEffect(() => {
    if (!account) {
      setBalance('—');
      setIsOwner(false);
      return;
    }

    // Tag this fetch so we can discard results if account changes
    const id = Symbol();
    fetchRef.current = id;

    const run = async () => {
      try {
        const provider = getProvider();

        // Balance — 3 s timeout
        try {
          const bal = await withTimeout(provider.getBalance(account), 3000);
          if (fetchRef.current !== id) return;
          setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
        } catch {
          if (fetchRef.current === id) setBalance('?');
        }

        // Owner check — 3 s timeout, silently fails if contract not deployed
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const owner = await withTimeout(contract.owner(), 3000);
          if (fetchRef.current !== id) return;
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch {
          if (fetchRef.current === id) setIsOwner(false);
        }
      } catch {
        // provider itself failed — ignore
      }
    };

    run();
  }, [account]);

  return (
    <>
      <div className="hex-grid" />

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
