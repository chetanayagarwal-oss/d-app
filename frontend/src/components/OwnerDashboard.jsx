import React, { useState, useEffect } from 'react';
import { getContractWithSigner, getProvider } from '../utils/contract';
import { ethers } from 'ethers';

function OwnerDashboard({ account }) {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores agent address being actioned
  const [error, setError] = useState('');

  // Note: We don't have a built-in way to list all registered agents in the provided contract 
  // without relying on events or an off-chain indexer. For demonstration, we'll maintain 
  // a list of agents fetched from events.
  const loadAgents = async () => {
    try {
      const contract = await getContractWithSigner();
      // Fetch past AgentRegistered events
      const filter = contract.filters.AgentRegistered();
      const events = await contract.queryFilter(filter);
      
      const loadedAgents = [];
      for (let event of events) {
        const agentAddr = event.args.agent;
        const info = await contract.getAgentInfo(agentAddr);
        loadedAgents.push({
          address: agentAddr,
          limit: ethers.formatEther(info.limit),
          totalSpent: ethers.formatEther(info.totalSpent),
          isPaused: info.isPaused,
          isRegistered: info.isRegistered
        });
      }
      setAgents(loadedAgents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAgents();
  }, [account]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!newAgent || !newLimit) return;
    if (!ethers.isAddress(newAgent)) {
        setError('Invalid agent address');
        return;
    }
    if (parseFloat(newLimit) <= 0) {
        setError('Limit must be greater than 0');
        return;
    }

    setIsRegistering(true);
    try {
      const contract = await getContractWithSigner();
      const limitWei = ethers.parseEther(newLimit);
      const tx = await contract.registerAgent(newAgent, limitWei);
      await tx.wait();
      await loadAgents();
      setNewAgent('');
      setNewLimit('');
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTogglePause = async (agentAddr, isPaused) => {
    setActionLoading(agentAddr);
    try {
      const contract = await getContractWithSigner();
      const tx = isPaused 
        ? await contract.unpauseAgent(agentAddr)
        : await contract.pauseAgent(agentAddr);
      await tx.wait();
      await loadAgents();
    } catch (err) {
      alert(err.reason || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    setIsDepositing(true);
    try {
      const signer = await getProvider().getSigner();
      const contract = await getContractWithSigner();
      const targetAddress = await contract.getAddress();
      const tx = await signer.sendTransaction({
          to: targetAddress,
          value: ethers.parseEther(depositAmount)
      });
      await tx.wait();
      setDepositAmount('');
      alert('Deposit successful!');
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="panel">
      <h2 className="panel-title">OWNER DASHBOARD</h2>
      
      {error && <div className="error-message" style={{marginBottom: '1rem'}}>{error}</div>}
      
      <div className="dashboard-grid">
        <div>
          <h3>REGISTER NEW AGENT</h3>
          <form onSubmit={handleRegister} style={{marginTop: '1rem'}}>
            <div className="form-group">
              <label>Agent Address</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="0x..." 
                value={newAgent} 
                onChange={(e)=>setNewAgent(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Spending Limit (ETH)</label>
              <input 
                type="number" 
                step="any" 
                className="form-control" 
                placeholder="0.0" 
                value={newLimit} 
                onChange={(e)=>setNewLimit(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn" disabled={isRegistering || !newAgent || !newLimit}>
              {isRegistering ? <><span className="spinner"></span>PROCESSING</> : 'REGISTER'}
            </button>
          </form>
        </div>

        <div>
           <h3>DEPOSIT ETH TO CONTRACT</h3>
           <form onSubmit={handleDeposit} style={{marginTop: '1rem'}}>
            <div className="form-group">
              <label>Amount (ETH)</label>
              <input 
                type="number" 
                step="any" 
                className="form-control" 
                placeholder="0.0" 
                value={depositAmount} 
                onChange={(e)=>setDepositAmount(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn" disabled={isDepositing || !depositAmount}>
              {isDepositing ? <><span className="spinner"></span>DEPOSITING</> : 'DEPOSIT'}
            </button>
          </form>
        </div>
      </div>

      <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>REGISTERED AGENTS</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Limit (ETH)</th>
              <th>Total Spent (ETH)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign:'center', color: 'var(--text-muted)'}}>No agents registered yet.</td></tr>
            ) : agents.map(agent => (
              <tr key={agent.address}>
                <td style={{fontFamily: 'var(--font-data)'}}>{agent.address.substring(0,6)}...{agent.address.substring(38)}</td>
                <td>{agent.limit}</td>
                <td>{agent.totalSpent}</td>
                <td>
                  <span className={`badge ${agent.isPaused ? 'badge-paused' : 'badge-active'}`}>
                    {agent.isPaused ? 'PAUSED' : 'ACTIVE'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn ${agent.isPaused ? '' : 'btn-danger'}`} 
                    style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}
                    onClick={() => handleTogglePause(agent.address, agent.isPaused)}
                    disabled={actionLoading === agent.address}
                  >
                    {actionLoading === agent.address ? <span className="spinner" style={{width:'0.8rem', height:'0.8rem'}}></span> : (agent.isPaused ? 'UNPAUSE' : 'PAUSE')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OwnerDashboard;
