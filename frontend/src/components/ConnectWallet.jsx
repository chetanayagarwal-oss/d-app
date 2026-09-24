import React from 'react';

function ConnectWallet({ account, setAccount, balance, isOwner }) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState('');

  const connect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it from metamask.io');
        setIsConnecting(false);
        return;
      }

      // Some browsers have multiple injected providers — pick MetaMask specifically
      let provider = window.ethereum;
      if (window.ethereum.providers?.length) {
        provider = window.ethereum.providers.find((p) => p.isMetaMask) ?? window.ethereum;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        setError('No accounts returned. Unlock MetaMask and try again.');
        return;
      }

      setAccount(accounts[0]);
    } catch (err) {
      if (err.code === 4001) {
        setError('You rejected the connection request.');
      } else if (err.code === -32002) {
        setError('MetaMask popup is already open. Check the extension.');
      } else {
        setError(err.message || 'Failed to connect wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const shortAddr = (addr) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

  const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum;

  return (
    <>
      {/* ── Sticky Navbar ── */}
      <header
        style={{
          borderBottom: '1px solid rgba(0,255,163,0.08)',
          background: 'rgba(4,4,12,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="header">
          <div className="header-brand">
            <h1>SENTINELPAY</h1>
            <span className="tagline">AI Agent Payment Firewall · Ethereum</span>
          </div>

          <nav className="header-nav">
            {account ? (
              <div className="wallet-info">
                {isOwner && (
                  <span className="badge badge-owner">⬡ OWNER</span>
                )}
                <span className="wallet-balance">{balance} ETH</span>
                <span className="wallet-address" title={account}>
                  {shortAddr(account)}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <button
                  id="connect-wallet-btn"
                  className="wallet-btn"
                  onClick={connect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <><span className="spinner" /> CONNECTING…</>
                  ) : (
                    <><span className="dot" /> CONNECT METAMASK</>
                  )}
                </button>
                {error && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--danger)',
                      maxWidth: '280px',
                      textAlign: 'right',
                      lineHeight: '1.4',
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero (shown when not connected) ── */}
      {!account && (
        <section className="hero">
          <div className="hero-badge">
            <span className="live-dot" /> LIVE ON SEPOLIA TESTNET
          </div>

          <h2>
            The <span>Smart Guard</span> for
            <br />
            Autonomous AI Agents
          </h2>

          <p>
            SentinelPay enforces granular spend limits, instant pause controls,
            and real-time audit trails for every on-chain AI agent payment.
          </p>

          <div className="hero-cta">
            {!hasMetaMask ? (
              <a
                id="install-metamask-btn"
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ fontSize: '0.85rem', padding: '1rem 2.5rem', textDecoration: 'none' }}
              >
                🦊 INSTALL METAMASK FIRST
              </a>
            ) : (
              <button
                id="hero-connect-btn"
                className="btn"
                onClick={connect}
                disabled={isConnecting}
                style={{ fontSize: '0.85rem', padding: '1rem 2.5rem' }}
              >
                {isConnecting ? (
                  <><span className="spinner" /> CONNECTING…</>
                ) : (
                  '⬡ CONNECT WALLET TO START'
                )}
              </button>
            )}

            {error && (
              <div
                style={{
                  marginTop: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--danger)',
                  background: 'rgba(255,45,85,0.08)',
                  border: '1px solid rgba(255,45,85,0.2)',
                  borderRadius: '6px',
                  padding: '0.6rem 1rem',
                  display: 'inline-block',
                }}
              >
                {error}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default ConnectWallet;
