import React from 'react';

function ConnectWallet({ account, setAccount, balance, setBalance, isOwner }) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState('');

  const connect = async () => {
    setIsConnecting(true);
    setError('');
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to use this app.");
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected by user.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="header">
      <div>
        <h1>SentinelPay</h1>
        <p style={{ color: 'var(--text-muted)' }}>AI Agent Payment Firewall</p>
      </div>
      <div>
        {account ? (
          <div style={{ textAlign: 'right' }}>
            <span style={{ marginRight: '1rem', color: 'var(--accent-neon)' }}>
              {isOwner && <span className="badge badge-active" style={{marginRight: '1rem'}}>OWNER</span>}
              {balance} ETH
            </span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
              {account.substring(0, 6)}...{account.substring(38)}
            </span>
          </div>
        ) : (
          <div>
            <button className="btn" onClick={connect} disabled={isConnecting}>
              {isConnecting ? (
                  <><span className="spinner"></span>CONNECTING...</>
              ) : 'CONNECT METAMASK'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectWallet;
