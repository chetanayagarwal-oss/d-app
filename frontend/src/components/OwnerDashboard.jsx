import React, { useState, useEffect } from 'react';
import { getContractWithSigner, getProvider } from '../utils/contract';
import { ethers } from 'ethers';

function OwnerDashboard({ account }) {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('0');

  const [isRegistering, setIsRegistering] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAgents = async () => {
    try {
      const contract = await getContractWithSigner();
      const filter = contract.filters.AgentRegistered();
      const events = await contract.queryFilter(filter);
      const loaded = [];
      for (let event of events) {
        const addr = event.args.agent;
        const info = await contract.getAgentInfo(addr);
        loaded.push({
          address: addr,
          limit: ethers.formatEther(info.limit),
          totalSpent: ethers.formatEther(info.totalSpent),
          isPaused: info.isPaused,
          isRegistered: info.isRegistered,
        });
      }
      setAgents(loaded);

      // contract balance
      const provider = getProvider();
      const contractAddr = await contract.getAddress();
      const bal = await provider.getBalance(contractAddr);
      setContractBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadAgents(); }, [account]);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!ethers.isAddress(newAgent)) { setError('Invalid agent address'); return; }
    if (parseFloat(newLimit) <= 0) { setError('Limit must be > 0'); return; }
    setIsRegistering(true);
    try {
      const contract = await getContractWithSigner();
      const tx = await contract.registerAgent(newAgent, ethers.parseEther(newLimit));
      await tx.wait();
      await loadAgents();
      setNewAgent(''); setNewLimit('');
      flash('Agent registered successfully.');
    } catch (err) { setError(err.reason || err.message); }
    finally { setIsRegistering(false); }
  };

  const handleTogglePause = async (agentAddr, isPaused) => {
    setActionLoading(agentAddr);
    try {
      const contract = await getContractWithSigner();
      const tx = isPaused ? await contract.unpauseAgent(agentAddr) : await contract.pauseAgent(agentAddr);
      await tx.wait();
      await loadAgents();
    } catch (err) { alert(err.reason || err.message); }
    finally { setActionLoading(null); }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    setIsDepositing(true);
    try {
      const signer = await getProvider().getSigner();
      const contract = await getContractWithSigner();
      const targetAddr = await contract.getAddress();
      const tx = await signer.sendTransaction({ to: targetAddr, value: ethers.parseEther(depositAmount) });
      await tx.wait();
      setDepositAmount('');
      await loadAgents();
      flash(`Deposited ${depositAmount} ETH successfully.`);
    } catch (err) { setError(err.reason || err.message); }
    finally { setIsDepositing(false); }
  };

  const short = (a) => `${a.slice(0, 8)}…${a.slice(-6)}`;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* ── Stats Row ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <div className="stat-value">{agents.length}</div>
          <div className="stat-label">Registered Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{agents.filter(a => !a.isPaused).length}</div>
          <div className="stat-label">Active Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⬡</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{contractBalance}</div>
          <div className="stat-label">Contract Balance (ETH)</div>
        </div>
      </div>

      {/* ── Owner Panel ── */}
      <div className="panel panel-accent panel-scanline">
        <h2 className="panel-title">
          <span className="title-icon purple">⬡</span>
          OWNER DASHBOARD
        </h2>

        {error && <div className="error-message" style={{ marginBottom: '1.25rem' }}>{error}</div>}
        {successMsg && (
          <div style={{
            background: 'rgba(0,255,163,0.07)', border: '1px solid rgba(0,255,163,0.25)',
            borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--neon)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            ✓ {successMsg}
          </div>
        )}

        <div className="owner-grid">
          {/* Register */}
          <div>
            <div className="section-label">Register New Agent</div>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Agent Address</label>
                <input id="agent-address-input" type="text" className="form-control" placeholder="0x…" value={newAgent} onChange={e => setNewAgent(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Spending Limit (ETH)</label>
                <input id="agent-limit-input" type="number" step="any" className="form-control" placeholder="0.00" value={newLimit} onChange={e => setNewLimit(e.target.value)} />
              </div>
              <button id="register-agent-btn" type="submit" className="btn" disabled={isRegistering || !newAgent || !newLimit}>
                {isRegistering ? <><span className="spinner" />PROCESSING…</> : '+ REGISTER AGENT'}
              </button>
            </form>
          </div>

          {/* Deposit */}
          <div>
            <div className="section-label">Deposit ETH to Contract</div>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label>Amount (ETH)</label>
                <input id="deposit-amount-input" type="number" step="any" className="form-control" placeholder="0.00" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
              </div>
              <button id="deposit-btn" type="submit" className="btn" disabled={isDepositing || !depositAmount}>
                {isDepositing ? <><span className="spinner" />DEPOSITING…</> : '↑ DEPOSIT'}
              </button>
            </form>

            {/* Contract address hint */}
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '0.35rem' }}>
                CONTRACT VAULT
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', color: 'var(--neon)', textShadow: 'var(--neon-glow)' }}>
                {contractBalance} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ETH</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Agent Table ── */}
        <div className="section-label" style={{ marginTop: '2rem' }}>Registered Agents</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Limit (ETH)</th>
                <th>Spent (ETH)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr><td colSpan="5" className="table-empty">No agents registered yet.</td></tr>
              ) : agents.map(agent => (
                <tr key={agent.address}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{short(agent.address)}</td>
                  <td>{agent.limit}</td>
                  <td>
                    <span style={{ color: parseFloat(agent.totalSpent) > 0 ? 'var(--neon)' : 'var(--text-muted)' }}>
                      {agent.totalSpent}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${agent.isPaused ? 'badge-paused' : 'badge-active'}`}>
                      {agent.isPaused ? '⏸ PAUSED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td>
                    <button
                      id={`toggle-agent-${agent.address}`}
                      className={`btn btn-sm ${agent.isPaused ? '' : 'btn-danger'}`}
                      onClick={() => handleTogglePause(agent.address, agent.isPaused)}
                      disabled={actionLoading === agent.address}
                    >
                      {actionLoading === agent.address
                        ? <span className="spinner" style={{ width: '10px', height: '10px' }} />
                        : agent.isPaused ? 'RESUME' : 'PAUSE'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
