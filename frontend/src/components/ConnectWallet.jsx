import React from 'react';

function ConnectWallet({ account, setAccount, balance, isOwner }) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState('');

  const connect = async () => {
    setIsConnecting(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error('MetaMask not installed.');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.code === 4001 ? 'Connection rejected.' : (err.message || 'Failed to connect'));
    } finally {
      setIsConnecting(false);
    }
  };

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

  return (
    <>
      {/* ── Top Navbar ── */}
      <header style={{
        borderBottom: '1px solid rgba(0,255,163,0.08)',
        background: 'rgba(4,4,12,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="header">
          <div className="header-brand">
            <h1>SENTINELPAY</h1>
            <span className="tagline">AI Agent Payment Firewall · Ethereum</span>
          </div>

          <nav className="header-nav">
            {account ? (
              <div className="wallet-info">
                {isOwner && <span className="badge badge-owner">⬡ OWNER</span>}
                <span className="wallet-balance">{balance} ETH</span>
                <span className="wallet-address">{shortAddr(account)}</span>
              </div>
            ) : (
              <div>
                <button
                  id="connect-wallet-btn"
                  className="wallet-btn"
                  onClick={connect}
                  disabled={isConnecting}
                >
                  {isConnecting
                    ? <><span className="spinner" />CONNECTING</>
                    : <><span className="dot" />CONNECT METAMASK</>}
                </button>
                {error && <div className="error-message" style={{ marginTop: '0.5rem' }}>{error}</div>}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero Section ── */}
      {!account && (
        <section className="hero">
          <div className="hero-badge">⬡ LIVE ON SEPOLIA TESTNET</div>
          <h2>The <span>Smart Guard</span> for<br />Autonomous AI Agents</h2>
          <p>
            SentinelPay enforces granular spend limits, instant pause controls,
            and real-time audit trails for every on-chain AI agent payment.
          </p>
          <button
            id="hero-connect-btn"
            className="btn"
            onClick={connect}
            disabled={isConnecting}
            style={{ fontSize: '0.85rem', padding: '1rem 2.5rem' }}
          >
            {isConnecting ? <><span className="spinner" />CONNECTING…</> : '⬡ CONNECT WALLET TO START'}
          </button>
        </section>
      )}
    </>
  );
}

export default ConnectWallet;
