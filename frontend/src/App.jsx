import React, { useState, useEffect } from 'react';
import { getContractWithProvider } from './utils/contract';
import { ethers } from 'ethers';

import ConnectWallet from './components/ConnectWallet';
import OwnerDashboard from './components/OwnerDashboard';
import AgentSimulator from './components/AgentSimulator';
import TransactionLog from './components/TransactionLog';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : '');
    });

    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length > 0) setAccount(accounts[0]);
    });
  }, []);

  // Fetch balance + owner status
  useEffect(() => {
    const fetch = async () => {
      if (!account) { setBalance('0'); setIsOwner(false); return; }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(account);
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));

        const contract = getContractWithProvider();
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      } catch (err) {
        console.error('Error fetching details:', err);
      }
    };
    fetch();
  }, [account]);

  return (
    <>
      {/* Navbar + Hero */}
      <ConnectWallet
        account={account}
        setAccount={setAccount}
        balance={balance}
        setBalance={() => {}}
        isOwner={isOwner}
      />

      {account && (
        <main className="container">
          {/* Owner Dashboard (only for contract owner) */}
          {isOwner && <OwnerDashboard account={account} />}

          {/* Simulator + Log */}
          <div className="dashboard-grid">
            <AgentSimulator account={account} />
            <TransactionLog />
          </div>
        </main>
      )}

      <footer className="footer">
        ⬡ SENTINELPAY · AI AGENT PAYMENT FIREWALL · BUILT FOR THE DECENTRALIZED WEB
      </footer>
    </>
  );
}

export default App;
