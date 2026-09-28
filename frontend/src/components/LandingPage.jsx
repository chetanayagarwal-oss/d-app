import React from 'react';

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Native Security',
    desc: 'Purpose-built for autonomous AI agents. Every payment is verified against on-chain spend rules before execution.',
  },
  {
    icon: '⚡',
    title: 'Instant Enforcement',
    desc: 'Smart contract rules execute atomically. No delays, no off-chain approvals — enforcement happens at the EVM level.',
  },
  {
    icon: '🔒',
    title: 'Granular Limits',
    desc: 'Set per-agent ETH spending caps. Agents can never exceed their allocated budget, even under compromise.',
  },
  {
    icon: '📡',
    title: 'Real-Time Audit Log',
    desc: 'Every payment is indexed on-chain with agent address, recipient, amount, reason, and timestamp.',
  },
  {
    icon: '⏸',
    title: 'Instant Kill Switch',
    desc: 'Pause any agent in a single transaction. Compromised agents are blocked immediately with no downtime.',
  },
  {
    icon: '⬡',
    title: 'Fully Decentralized',
    desc: 'No backend, no admin keys outside the deployer. The contract is the only authority over agent payments.',
  },
];

const STATS = [
  { value: '100%', label: 'On-Chain Enforcement' },
  { value: '< 1s',  label: 'Block Finality' },
  { value: '0',     label: 'Trusted Intermediaries' },
];

function LandingPage({ onEnter }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ─────────────────────────────── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.4rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 900,
            letterSpacing: '5px', color: 'var(--neon)', textShadow: 'var(--neon-glow)',
          }}>SENTINELPAY</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)',
            letterSpacing: '3px',
          }}>AI AGENT PAYMENT FIREWALL</div>
        </div>

        <button
          id="nav-launch-btn"
          onClick={onEnter}
          className="btn btn-sm"
          style={{ letterSpacing: '2px' }}
        >
          LAUNCH APP →
        </button>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '6rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>

        {/* Live badge */}
        <div className="hero-badge" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <span className="live-dot" />
          LIVE ON SEPOLIA TESTNET
        </div>

        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
          fontWeight: 900, letterSpacing: '2px',
          color: 'var(--text-bright)', lineHeight: 1.1,
          marginBottom: '1.5rem',
          animation: 'reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        }}>
          The Neural Guard for<br />
          <span style={{ color: 'var(--neon)', textShadow: 'var(--neon-glow)' }}>
            Autonomous AI Agents
          </span>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px',
          margin: '0 auto 3rem', lineHeight: 1.85,
          animation: 'reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both',
        }}>
          SentinelPay enforces granular spend limits, instant kill switches, and
          immutable audit trails for every AI agent payment — enforced at the
          smart contract layer with zero trust assumptions.
        </p>

        <div style={{
          display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
          animation: 'reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both',
        }}>
          <button
            id="hero-launch-btn"
            onClick={onEnter}
            className="btn"
            style={{ fontSize: '0.9rem', padding: '1rem 2.8rem' }}
          >
            ⬡ LAUNCH APP
          </button>
          <a
            href="https://github.com/chetanayagarwal-oss/d-app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.9rem', padding: '1rem 2.8rem', textDecoration: 'none' }}
          >
            VIEW SOURCE ↗
          </a>
        </div>

        {/* EEG line */}
        <div className="hero-eeg">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path className="eeg-path" d="M0,30 L60,30 L70,30 L80,5 L90,55 L100,5 L110,55 L120,30 L130,30 L200,30 L210,30 L220,10 L230,50 L240,10 L250,50 L260,30 L270,30 L340,30 L350,30 L360,8 L370,52 L380,8 L390,52 L400,30 L410,30 L480,30 L490,30 L500,12 L510,48 L520,12 L530,48 L540,30 L550,30 L620,30 L630,30 L640,6 L650,54 L660,6 L670,54 L680,30 L690,30 L760,30 L770,30 L780,10 L790,50 L800,10 L810,50 L820,30 L830,30 L900,30 L910,30 L920,8 L930,52 L940,8 L950,52 L960,30 L970,30 L1040,30 L1050,30 L1060,5 L1070,55 L1080,5 L1090,55 L1100,30 L1110,30 L1200,30" />
          </svg>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────── */}
      <section style={{ padding: '2rem 2rem 4rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            >
              <div className="holo-sweep" />
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section style={{ padding: '2rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{
          textAlign: 'center', marginBottom: '3rem',
          animation: 'reveal-up 0.6s ease 0.2s both',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--neon)',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            CORE CAPABILITIES
          </div>
          <h2 style={{
            fontFamily: 'var(--font-head)', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 700, color: 'var(--text-bright)', letterSpacing: '1px',
          }}>
            Built for the Agentic Economy
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="panel"
              style={{
                animationDelay: `${0.05 + i * 0.1}s`,
                cursor: 'default',
              }}
            >
              <div style={{
                fontSize: '1.8rem', marginBottom: '0.75rem',
                display: 'block',
              }}>{f.icon}</div>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: '0.8rem',
                fontWeight: 700, letterSpacing: '2px', color: 'var(--text-bright)',
                marginBottom: '0.6rem', textTransform: 'uppercase',
              }}>{f.title}</div>
              <div style={{
                fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7,
              }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────── */}
      <section style={{ padding: '4rem 2rem 6rem', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(0,255,163,0.04)',
          border: '1px solid rgba(0,255,163,0.15)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          maxWidth: '700px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Corner brackets */}
          <div style={{ position:'absolute', top:16, left:16, width:20, height:20, borderTop:'2px solid var(--neon)', borderLeft:'2px solid var(--neon)', opacity:0.5 }} />
          <div style={{ position:'absolute', bottom:16, right:16, width:20, height:20, borderBottom:'2px solid var(--neon)', borderRight:'2px solid var(--neon)', opacity:0.5 }} />

          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
            fontWeight: 700, color: 'var(--text-bright)', marginBottom: '1rem',
            letterSpacing: '1px',
          }}>
            Ready to secure your AI agents?
          </div>
          <p style={{
            color: 'var(--text-muted)', marginBottom: '2rem',
            fontSize: '0.95rem', lineHeight: 1.7,
          }}>
            Connect your MetaMask wallet to register agents,<br />
            set spend limits, and monitor all transactions live.
          </p>
          <button
            id="cta-launch-btn"
            onClick={onEnter}
            className="btn"
            style={{ fontSize: '0.9rem', padding: '1rem 3rem' }}
          >
            ⬡ CONNECT &amp; LAUNCH
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="footer">
        ⬡ SENTINELPAY · AI NEURAL PAYMENT SECURITY · ETHEREUM
      </footer>
    </div>
  );
}

export default LandingPage;
