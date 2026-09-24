import React, { useState, useEffect } from 'react';
import { typewriter } from '../utils/motion';

function ConnectWallet({ account, setAccount, balance, isOwner }) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [typed, setTyped] = useState('');

  // Typewriter on the hero tagline
  useEffect(() => {
    if (account) return;
    const stop = typewriter(
      [
        'Payment Firewall for AI Agents.',
        'On-Chain Spend Enforcement.',
        'Real-Time Audit Trails.',
        'Granular Access Controls.',
      ],
      setTyped,
      { speed: 48, pause: 2000 }
    );
    return stop;
  }, [account]);

  const connect = async () => {
    setIsConnecting(true);
    setError('');
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it from metamask.io');
        setIsConnecting(false);
        return;
      }
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
      if (err.code === 4001)    setError('You rejected the connection request.');
      else if (err.code === -32002) setError('MetaMask popup already open. Check the extension.');
      else setError(err.message || 'Failed to connect wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <button
                  id="connect-wallet-btn"
                  className="wallet-btn"
                  onClick={connect}
                  disabled={isConnecting}
                >
                  {isConnecting
                    ? <><span className="spinner" /> CONNECTING…</>
                    : <><span className="dot" /> CONNECT METAMASK</>}
                </button>
                {error && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--danger)', maxWidth: '280px', textAlign: 'right', lineHeight: 1.4 }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero (unauthenticated) ── */}
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

          {/* Typewriter tagline */}
          <p>
            <span className="typewriter">{typed}</span>
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
                {isConnecting
                  ? <><span className="spinner" /> CONNECTING…</>
                  : '⬡ CONNECT WALLET TO START'}
              </button>
            )}

            {error && (
              <div style={{
                marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                color: 'var(--danger)', background: 'rgba(255,45,85,0.08)',
                border: '1px solid rgba(255,45,85,0.2)', borderRadius: '6px',
                padding: '0.6rem 1rem', display: 'inline-block',
              }}>
                {error}
              </div>
            )}
          </div>

          {/* ── Brainwave EEG ── */}
          <div className="hero-eeg">
            <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
              <path
                className="eeg-path"
                d="
                  M0,30 L60,30 L70,30 L80,5 L90,55 L100,5 L110,55 L120,30 L130,30
                  L200,30 L210,30 L220,10 L230,50 L240,10 L250,50 L260,30 L270,30
                  L340,30 L350,30 L360,8 L370,52 L380,8 L390,52 L400,30 L410,30
                  L480,30 L490,30 L500,12 L510,48 L520,12 L530,48 L540,30 L550,30
                  L620,30 L630,30 L640,6 L650,54 L660,6 L670,54 L680,30 L690,30
                  L760,30 L770,30 L780,10 L790,50 L800,10 L810,50 L820,30 L830,30
                  L900,30 L910,30 L920,8 L930,52 L940,8 L950,52 L960,30 L970,30
                  L1040,30 L1050,30 L1060,5 L1070,55 L1080,5 L1090,55 L1100,30 L1110,30
                  L1200,30
                "
              />
            </svg>
          </div>
        </section>
      )}
    </>
  );
}

export default ConnectWallet;
