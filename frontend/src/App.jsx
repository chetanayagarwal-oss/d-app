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

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
      
      // Initial check if already connected
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (account) {
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
      } else {
        setBalance('0');
        setIsOwner(false);
      }
    };

    fetchAccountDetails();
  }, [account]);

  return (
    <div className="container">
      <ConnectWallet 
        account={account} 
        setAccount={setAccount} 
        balance={balance} 
        setBalance={setBalance}
        isOwner={isOwner}
      />

      {isOwner && <OwnerDashboard account={account} />}
      
      <div className="dashboard-grid">
        <AgentSimulator account={account} />
        <TransactionLog />
      </div>
    </div>
  );
}

export default App;
