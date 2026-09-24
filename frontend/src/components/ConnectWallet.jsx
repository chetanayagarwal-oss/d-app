import React, { useState, useEffect } from 'react';
import { typewriter } from '../utils/motion';

function ConnectWallet({ account, setAccount, balance, isOwner }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [debug, setDebug] = useState('');

  // Typewriter on the hero tagline
  useEffect(() => {
    if (account) return;
    let stop;
    try {
      stop = typewriter(
        [
          'Payment Firewall for AI Agents.',
          'On-Chain Spend Enforcement.',
          'Real-Time Audit Trails.',
          'Granular Access Controls.',
        ],
        setTyped,
        { speed: 48, pause: 2000 }
      );
    } catch (e) {
      console.warn('typewriter error:', e);
    }
    return () => { if (stop) stop(); };
  }, [account]);

  const connect = async () => {
    setIsConnecting(true);
    setError('');
    setDebug('');

    try {
      // 1. Check MetaMask
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('MetaMask not found. Please install it from metamask.io');
        setIsConnecting(false);
        return;
      }

      setDebug('MetaMask detected...');

      // 2. Pick the right provider when multiple exist (Brave, Coinbase, etc.)
      let eth = window.ethereum;
      if (Array.isArray(window.ethereum.providers) && window.ethereum.providers.length > 0) {
        const mm = window.ethereum.providers.find((p) => p.isMetaMask);
        if (mm) eth = mm;
      }

      setDebug('Requesting accounts...');

      // 3. Request accounts
      const accounts = await eth.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        setError('No accounts returned. Please unlock MetaMask.');
        setIsConnecting(false);
        return;
      }

      setDebug('');
      setAccount(accounts[0]);

    } catch (err) {
      setDebug('');
      if (err.code === 4001) {
        setError('You rejected the request in MetaMask.');
      } else if (err.code === -32002) {
        setError('MetaMask popup is already open — click the MetaMask icon in your browser toolbar.');
      } else if (err.code === -32603) {
        setError('MetaMask internal error. Try refreshing the page.');
      } else {
        setError(`Error (${err.code ?? 'unknown'}): ${err.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const shortAddr = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum;

  return (
    <>
      {/* ── Sticky Navbar ── */}
      <header style={{
        borderBottom: '1px solid rgba(0,255,163,0.07)',
        background: 'rgba(3,3,10,0.92)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="header">
          <div className="header-brand">
            <h1>SENTINELPAY</h1>
            <span className="tagline">Neural Payment Security · Ethereum</span>
          </div>

          <nav className="header-nav">
            {account ? (
              <div className="wallet-info">
                {isOwner && <span className="badge badge-owner">⬡ OWNER</span>}
                <span className="wallet-balance">{balance} ETH</span>
                <span className="wallet-address" title={account}>{shortAddr(account)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                <button
                  id="connect-wallet-btn"
                  className="wallet-btn"
                  onClick={connect}
                  disabled={isConnecting}
                >
                  {isConnecting
                    ? <><span className="spinner" /> {debug || 'CONNECTING…'}</>
                    : <><span className="dot" /> CONNECT METAMASK</>}
                </button>
                {error && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    color: 'var(--danger)', maxWidth: '300px',
                    textAlign: 'right', lineHeight: 1.5,
                    background: 'rgba(255,45,85,0.07)',
                    border: '1px solid rgba(255,45,85,0.18)',
                    borderRadius: '6px', padding: '0.4rem 0.7rem',
                  }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      {!account && (
        <section className="hero">
          <div className="hero-badge">
            <span className="live-dot" />
            NEURAL SECURITY ACTIVE
          </div>

          <h2>
            The <span>AI-Powered</span> Guard<br />
            for Autonomous Agents
          </h2>

          <p>
            <span className="typewriter">{typed || '\u00a0'}</span>
          </p>

          <div className="hero-cta">
            {!hasMetaMask ? (
              /* No MetaMask installed */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--danger)',
                  background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.22)',
                  borderRadius: '8px', padding: '0.75rem 1.25rem',
                }}>
                  ⚠ MetaMask extension not detected in this browser.
                </div>
                <a
                  id="install-metamask-btn"
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ fontSize: '0.85rem', padding: '1rem 2.5rem', textDecoration: 'none' }}
                >
                  🦊 INSTALL METAMASK
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <button
                  id="hero-connect-btn"
                  className="btn"
                  onClick={connect}
                  disabled={isConnecting}
                  style={{ fontSize: '0.85rem', padding: '1rem 2.5rem' }}
                >
                  {isConnecting
                    ? <><span className="spinner" /> {debug || 'CONNECTING…'}</>
                    : '⬡ CONNECT WALLET TO START'}
                </button>

                {error && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--danger)',
                    background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.22)',
                    borderRadius: '8px', padding: '0.75rem 1.25rem', maxWidth: '420px',
                    textAlign: 'center', lineHeight: 1.6,
                  }}>
                    {error}
                  </div>
                )}

                {/* Checklist guide */}
                <div style={{
                  marginTop: '0.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: '0.35rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px', padding: '1rem 1.25rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)',
                }}>
                  <div style={{ color: 'var(--text-dim)', letterSpacing: '2px', marginBottom: '0.25rem' }}>CHECKLIST</div>
                  <div>✓ MetaMask is installed &amp; unlocked</div>
                  <div>✓ Set MetaMask network to <strong style={{ color: 'var(--neon)' }}>Sepolia Testnet</strong></div>
                  <div>✓ Accept the connection popup when it appears</div>
                  <div>✓ If nothing happens, click the MetaMask icon in your toolbar</div>
                </div>
              </div>
            )}
          </div>

          {/* Brainwave EEG */}
          <div className="hero-eeg">
            <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
              <path className="eeg-path" d="M0,30 L60,30 L70,30 L80,5 L90,55 L100,5 L110,55 L120,30 L130,30 L200,30 L210,30 L220,10 L230,50 L240,10 L250,50 L260,30 L270,30 L340,30 L350,30 L360,8 L370,52 L380,8 L390,52 L400,30 L410,30 L480,30 L490,30 L500,12 L510,48 L520,12 L530,48 L540,30 L550,30 L620,30 L630,30 L640,6 L650,54 L660,6 L670,54 L680,30 L690,30 L760,30 L770,30 L780,10 L790,50 L800,10 L810,50 L820,30 L830,30 L900,30 L910,30 L920,8 L930,52 L940,8 L950,52 L960,30 L970,30 L1040,30 L1050,30 L1060,5 L1070,55 L1080,5 L1090,55 L1100,30 L1110,30 L1200,30" />
            </svg>
          </div>
        </section>
      )}
    </>
  );
}

export default ConnectWallet;
