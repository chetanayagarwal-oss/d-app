import React, { useState, useEffect } from 'react';

const SECTIONS = [
  {
    id: 'setup',
    icon: '🦊',
    title: 'Getting Started',
    color: 'var(--neon)',
    steps: [
      {
        step: '01',
        title: 'Install MetaMask',
        desc: 'MetaMask is a browser wallet that lets you interact with Ethereum. Install the official extension from metamask.io for Chrome, Firefox, or Brave.',
        tip: 'Never share your seed phrase (12 words) with anyone — not even MetaMask support.',
        link: { label: '→ Download MetaMask', href: 'https://metamask.io/download/' },
      },
      {
        step: '02',
        title: 'Switch to Sepolia Testnet',
        desc: 'SentinelPay runs on the Sepolia test network — a safe sandbox where ETH has no real value. In MetaMask, click the network name at the top and select "Sepolia".',
        tip: 'If Sepolia is not visible, go to MetaMask Settings → Advanced → Show test networks.',
      },
      {
        step: '03',
        title: 'Get Free Test ETH',
        desc: 'You need Sepolia ETH to pay for gas fees. Visit a faucet, enter your wallet address, and request free test tokens.',
        tip: 'sepoliafaucet.com or alchemy.com/faucets/ethereum-sepolia are reliable free faucets.',
        link: { label: '→ Alchemy Sepolia Faucet', href: 'https://sepoliafaucet.com/' },
      },
      {
        step: '04',
        title: 'Connect Your Wallet',
        desc: 'Click "CONNECT METAMASK" in the top-right corner. MetaMask will pop up — click "Connect" to approve. Your address and ETH balance will appear immediately.',
        tip: 'If nothing happens, click the MetaMask fox icon in your browser toolbar and try again.',
      },
    ],
  },
  {
    id: 'transactions',
    icon: '⚡',
    title: 'Making a Payment',
    color: 'var(--neon)',
    steps: [
      {
        step: '01',
        title: 'Open the Agent Simulator',
        desc: 'Once connected, scroll down to the "AGENT SIMULATOR" panel on the left. This is where you execute payments through the smart contract.',
        tip: 'You must be a registered agent (added by the owner) before you can send payments.',
      },
      {
        step: '02',
        title: 'Enter Recipient Address',
        desc: 'Paste the destination Ethereum wallet address in the "Recipient Address" field. It must start with "0x" and be exactly 42 characters long.',
        tip: 'Double-check the address — blockchain transactions are irreversible.',
      },
      {
        step: '03',
        title: 'Set the Amount',
        desc: "Enter the amount of ETH to send. You cannot exceed your agent's spending limit set by the contract owner. Even 0.001 ETH is enough for a test.",
        tip: 'The contract will automatically block the transaction if you exceed your limit.',
      },
      {
        step: '04',
        title: 'Add a Reason',
        desc: 'Type a short description of why this payment is being made (e.g. "API access fee", "compute cost"). This is stored permanently on-chain as part of the audit trail.',
      },
      {
        step: '05',
        title: 'Execute & Confirm',
        desc: 'Click "⚡ EXECUTE PAYMENT". MetaMask will show a confirmation popup with the gas fee. Review and click "Confirm". Wait a few seconds for the transaction to be mined.',
        tip: 'You can view the confirmed transaction on Etherscan using the link that appears after success.',
      },
    ],
  },
  {
    id: 'owner',
    icon: '⬡',
    title: 'Owner Controls',
    color: 'var(--purple)',
    steps: [
      {
        step: '01',
        title: 'Owner Badge',
        desc: "If you deployed the contract, you are the owner. You'll see a purple \"⬡ OWNER\" badge in the top navbar after connecting. The Owner Dashboard appears automatically.",
        tip: 'Only the wallet address that deployed the contract has owner privileges.',
      },
      {
        step: '02',
        title: 'Register an Agent',
        desc: 'In the Owner Dashboard, enter an Ethereum address and a spending limit in ETH. Click "+ REGISTER AGENT" and confirm in MetaMask. That address can now execute payments.',
      },
      {
        step: '03',
        title: 'Deposit ETH to Contract',
        desc: 'The contract needs ETH to fund agent payments. Enter an amount in the "Deposit ETH" form and confirm the transaction. The contract vault balance updates in real time.',
      },
      {
        step: '04',
        title: 'Pause / Resume Agents',
        desc: 'In the Registered Agents table, click "PAUSE" next to any agent to instantly block them from making payments. Click "RESUME" to re-enable.',
        tip: 'Pausing takes effect immediately — the agent cannot execute any payment while paused.',
      },
    ],
  },
  {
    id: 'faq',
    icon: '❓',
    title: 'FAQ',
    color: 'var(--cyan)',
    faqs: [
      {
        q: 'Is my real money at risk?',
        a: 'No. SentinelPay runs on Sepolia Testnet — a practice network. Sepolia ETH has zero real-world value and is given away free by faucets.',
      },
      {
        q: 'Why is the transaction taking long?',
        a: 'Blockchain transactions depend on network congestion. Sepolia is usually fast (5–20 seconds), but can occasionally be slower. Check status on sepolia.etherscan.io.',
      },
      {
        q: 'I see "Contract not deployed" — what does that mean?',
        a: "The smart contract is not yet deployed to Sepolia, or you're on the wrong network. Make sure MetaMask is set to Sepolia and the contract has been deployed.",
      },
      {
        q: 'My wallet is connected but I cannot execute payments.',
        a: 'Your wallet address must be registered as an agent by the contract owner first. Ask the owner to register your address with a spending limit.',
      },
      {
        q: 'What are gas fees?',
        a: 'Gas fees are small ETH amounts paid to validators to process your transaction. On Sepolia Testnet, these use free test ETH — they cost you nothing real.',
      },
      {
        q: 'Where are my transactions stored?',
        a: 'Every payment is permanently recorded on the Ethereum Sepolia blockchain. You can view them in the "LIVE TRANSACTION LOG" panel or on sepolia.etherscan.io.',
      },
    ],
  },
];

function UserManual({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('setup');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const section = SECTIONS.find(s => s.id === activeSection);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(3,3,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'manual-backdrop-in 0.3s ease forwards',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes manual-backdrop-in { from { opacity:0; } to { opacity:1; } }
        @keyframes manual-slide-in {
          from { opacity:0; transform:translateY(32px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .manual-tab:hover { background:rgba(0,255,163,0.07)!important; color:var(--text)!important; }
        .manual-tab.active-tab { background:rgba(0,255,163,0.10)!important; border-color:rgba(0,255,163,0.3)!important; color:var(--neon)!important; }
        .faq-item:hover { border-color:rgba(0,255,163,0.2)!important; }
        .step-card { transition:all 0.25s ease; }
        .step-card:hover { border-color:rgba(0,255,163,0.2)!important; transform:translateX(4px); }
        .manual-close:hover { color:var(--neon)!important; background:rgba(0,255,163,0.08)!important; }
      `}</style>

      <div style={{
        width:'100%', maxWidth:'900px', maxHeight:'88vh',
        background:'rgba(8,8,20,0.98)',
        border:'1px solid rgba(0,255,163,0.18)',
        borderRadius:'20px',
        display:'flex', flexDirection:'column',
        animation:'manual-slide-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        overflow:'hidden',
        boxShadow:'0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(0,255,163,0.04)',
      }}>

        {/* Header */}
        <div style={{
          padding:'1.5rem 2rem',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'rgba(0,255,163,0.02)',
          flexShrink:0,
        }}>
          <div>
            <div style={{
              fontFamily:'var(--font-head)', fontSize:'1rem', fontWeight:900,
              letterSpacing:'4px', color:'var(--neon)', textShadow:'var(--neon-glow)',
            }}>USER MANUAL</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:'0.62rem',
              color:'var(--text-muted)', letterSpacing:'2px', marginTop:'2px',
            }}>SENTINELPAY · BEGINNER GUIDE · v1.0</div>
          </div>
          <button
            className="manual-close"
            onClick={onClose}
            style={{
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:'8px', padding:'0.45rem 0.75rem',
              color:'var(--text-muted)', fontFamily:'var(--font-mono)',
              fontSize:'0.75rem', cursor:'pointer', letterSpacing:'1px',
              transition:'all 0.2s ease',
            }}
          >✕ CLOSE</button>
        </div>

        {/* Body */}
        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

          {/* Sidebar */}
          <div style={{
            width:'200px', flexShrink:0,
            padding:'1.25rem 1rem',
            borderRight:'1px solid rgba(255,255,255,0.05)',
            display:'flex', flexDirection:'column', gap:'0.4rem',
            overflowY:'auto',
          }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`manual-tab${activeSection === s.id ? ' active-tab' : ''}`}
                onClick={() => { setActiveSection(s.id); setExpandedFaq(null); }}
                style={{
                  display:'flex', alignItems:'center', gap:'0.6rem',
                  background:'transparent', border:'1px solid transparent',
                  borderRadius:'8px', padding:'0.65rem 0.8rem',
                  color: activeSection === s.id ? 'var(--neon)' : 'var(--text-muted)',
                  fontFamily:'var(--font-mono)', fontSize:'0.68rem',
                  letterSpacing:'1px', cursor:'pointer',
                  textAlign:'left', width:'100%',
                  transition:'all 0.2s ease',
                }}
              >
                <span style={{ fontSize:'1rem' }}>{s.icon}</span>
                {s.title}
              </button>
            ))}

            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', margin:'0.5rem 0' }} />
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:'0.6rem',
              color:'var(--text-dim)', letterSpacing:'2px', padding:'0.2rem 0.6rem',
            }}>LINKS</div>
            {[
              { label:'Etherscan Sepolia', href:'https://sepolia.etherscan.io' },
              { label:'MetaMask Docs', href:'https://docs.metamask.io' },
              { label:'Sepolia Faucet', href:'https://sepoliafaucet.com' },
            ].map(l => (
              <a
                key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'block', fontFamily:'var(--font-mono)', fontSize:'0.62rem',
                  color:'var(--text-muted)', padding:'0.45rem 0.8rem',
                  borderRadius:'6px', textDecoration:'none',
                  border:'1px solid transparent', transition:'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--neon)'; e.currentTarget.style.borderColor='rgba(0,255,163,0.15)'; e.currentTarget.style.background='rgba(0,255,163,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}
              >↗ {l.label}</a>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:'auto', padding:'1.75rem 2rem' }}>

            {/* Section title */}
            <div style={{ marginBottom:'1.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'1.5rem' }}>{section.icon}</span>
                <h2 style={{
                  fontFamily:'var(--font-head)', fontSize:'0.9rem',
                  fontWeight:700, letterSpacing:'3px', color: section.color,
                  textShadow: section.id === 'owner' ? 'var(--purple-glow)' : section.id === 'faq' ? '0 0 8px rgba(0,212,255,0.5)' : 'var(--neon-glow)',
                }}>
                  {section.title.toUpperCase()}
                </h2>
              </div>
              <div style={{
                height:'1px',
                background: `linear-gradient(90deg, ${
                  section.id === 'owner' ? 'rgba(168,85,247,0.35)' :
                  section.id === 'faq'   ? 'rgba(0,212,255,0.35)'  :
                  'rgba(0,255,163,0.35)'
                }, transparent)`,
              }} />
            </div>

            {/* Steps */}
            {section.steps && (
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {section.steps.map((item, i) => (
                  <div key={i} className="step-card" style={{
                    background:'rgba(0,0,0,0.3)',
                    border:'1px solid rgba(255,255,255,0.06)',
                    borderRadius:'12px', padding:'1.25rem 1.5rem',
                    display:'flex', gap:'1.25rem',
                  }}>
                    <div style={{
                      width:'40px', height:'40px', flexShrink:0,
                      background: section.id === 'owner' ? 'rgba(168,85,247,0.1)' : 'rgba(0,255,163,0.08)',
                      border:`1px solid ${section.id === 'owner' ? 'rgba(168,85,247,0.25)' : 'rgba(0,255,163,0.2)'}`,
                      borderRadius:'10px',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'var(--font-head)', fontSize:'0.72rem', fontWeight:900,
                      color: section.id === 'owner' ? 'var(--purple)' : 'var(--neon)',
                      letterSpacing:'1px',
                    }}>{item.step}</div>
                    <div style={{ flex:1 }}>
                      <div style={{
                        fontFamily:'var(--font-head)', fontSize:'0.78rem',
                        fontWeight:700, letterSpacing:'1px',
                        color:'var(--text-bright)', marginBottom:'0.5rem',
                      }}>{item.title}</div>
                      <div style={{
                        fontFamily:'var(--font-body)', fontSize:'0.87rem',
                        color:'var(--text-muted)', lineHeight:1.75,
                        marginBottom: item.tip || item.link ? '0.75rem' : 0,
                      }}>{item.desc}</div>
                      {item.tip && (
                        <div style={{
                          display:'flex', gap:'0.5rem',
                          background:'rgba(0,212,255,0.05)',
                          border:'1px solid rgba(0,212,255,0.15)',
                          borderRadius:'6px', padding:'0.5rem 0.75rem',
                          fontFamily:'var(--font-mono)', fontSize:'0.7rem',
                          color:'var(--cyan)', lineHeight:1.6,
                          marginBottom: item.link ? '0.6rem' : 0,
                        }}>
                          <span style={{ flexShrink:0 }}>💡</span>{item.tip}
                        </div>
                      )}
                      {item.link && (
                        <a href={item.link.href} target="_blank" rel="noopener noreferrer"
                          style={{
                            display:'inline-flex', alignItems:'center',
                            fontFamily:'var(--font-mono)', fontSize:'0.7rem',
                            color:'var(--neon)', textDecoration:'none', letterSpacing:'1px',
                            transition:'text-shadow 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.textShadow='var(--neon-glow)'}
                          onMouseLeave={e => e.currentTarget.style.textShadow='none'}
                        >{item.link.label}</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ */}
            {section.faqs && (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {section.faqs.map((faq, i) => (
                  <div key={i} className="faq-item"
                    style={{
                      background:'rgba(0,0,0,0.3)',
                      border:'1px solid rgba(255,255,255,0.06)',
                      borderRadius:'10px', overflow:'hidden',
                      transition:'border-color 0.2s ease', cursor:'pointer',
                    }}
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'1rem 1.25rem',
                    }}>
                      <div style={{
                        fontFamily:'var(--font-body)', fontSize:'0.9rem',
                        color:'var(--text-bright)', fontWeight:500,
                      }}>{faq.q}</div>
                      <span style={{
                        fontFamily:'var(--font-mono)', fontSize:'0.8rem',
                        color:'var(--neon)', marginLeft:'1rem', flexShrink:0,
                        display:'inline-block',
                        transform: expandedFaq === i ? 'rotate(45deg)' : 'none',
                        transition:'transform 0.25s ease',
                      }}>+</span>
                    </div>
                    {expandedFaq === i && (
                      <div style={{
                        padding:'0.85rem 1.25rem 1rem',
                        fontFamily:'var(--font-body)', fontSize:'0.86rem',
                        color:'var(--text-muted)', lineHeight:1.75,
                        borderTop:'1px solid rgba(255,255,255,0.05)',
                      }}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ height:'1rem' }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding:'0.9rem 2rem',
          borderTop:'1px solid rgba(255,255,255,0.05)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink:0, background:'rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', color:'var(--text-dim)', letterSpacing:'2px' }}>
            ⬡ SENTINELPAY · AI AGENT PAYMENT FIREWALL
          </span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', color:'var(--text-dim)', letterSpacing:'1px' }}>
            Press{' '}
            <kbd style={{
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:'4px', padding:'0.1rem 0.35rem', fontSize:'0.6rem',
            }}>ESC</kbd>{' '}
            to close
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserManual;
