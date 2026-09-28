import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, getProvider } from './utils/contract';

import LandingPage from './components/LandingPage';
import ConnectWallet from './components/ConnectWallet';
import OwnerDashboard from './components/OwnerDashboard';
import AgentSimulator from './components/AgentSimulator';
import TransactionLog from './components/TransactionLog';
import ErrorBoundary from './components/ErrorBoundary';

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

function App() {
  // 'landing' → show landing page, 'app' → show dApp
  // Initialise from sessionStorage so a refresh keeps the user on the same page
  const [page, setPage]       = useState(() => sessionStorage.getItem('sp-page') || 'landing');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('—');
  const [isOwner, setIsOwner] = useState(false);
  const fetchRef = useRef(null);

  // Wrapper that persists page changes across refreshes
  const syncPage = (p) => {
    sessionStorage.setItem('sp-page', p);
    setPage(p);
  };

  // Auto-enter app if wallet already connected
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChange = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : '');
    };

    window.ethereum.on('accountsChanged', handleChange);

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // If already connected, go straight to app
          syncPage('app');
        }
      })
      .catch(() => {});

    return () => {
      try { window.ethereum.removeListener('accountsChanged', handleChange); } catch {}
    };
  }, []);

  // Background balance + owner fetch — never blocks UI
  useEffect(() => {
    if (!account) { setBalance('—'); setIsOwner(false); return; }

    const id = Symbol();
    fetchRef.current = id;

    (async () => {
      try {
        const provider = getProvider();
        const bal = await withTimeout(provider.getBalance(account), 5000);
        if (fetchRef.current !== id) return;
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
      } catch { if (fetchRef.current === id) setBalance('?'); }

      try {
        const provider = getProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const owner = await withTimeout(contract.owner(), 5000);
        if (fetchRef.current !== id) return;
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      } catch { if (fetchRef.current === id) setIsOwner(false); }
    })();
  }, [account]);

  // ── Landing page ──
  if (page === 'landing') {
    return (
      <>
        <div className="hex-grid" />
        <LandingPage onEnter={() => syncPage('app')} />
      </>
    );
  }

  // ── dApp ──
  return (
    <>
      <div className="hex-grid" />

      <ConnectWallet
        account={account}
        setAccount={(acc) => {
          setAccount(acc);
          if (acc) syncPage('app');
        }}
        balance={balance}
        isOwner={isOwner}
        onBack={() => syncPage('landing')}
      />

      {account && (
        <main className="container">
          <ErrorBoundary label="OWNER DASHBOARD OFFLINE">
            {isOwner && <OwnerDashboard account={account} />}
          </ErrorBoundary>

          <div className="dashboard-grid">
            <ErrorBoundary label="AGENT SIMULATOR OFFLINE">
              <AgentSimulator account={account} />
            </ErrorBoundary>
            <ErrorBoundary label="TRANSACTION LOG OFFLINE">
              <TransactionLog />
            </ErrorBoundary>
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
