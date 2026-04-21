import React, { useState } from 'react';
import { getContractWithSigner } from '../utils/contract';
import { ethers } from 'ethers';

function AgentSimulator({ account }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);

  const handleExecute = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!ethers.isAddress(recipient)) {
      setResult({ status: 'error', message: 'Invalid recipient address' });
      return;
    }
    if (parseFloat(amount) <= 0) {
      setResult({ status: 'error', message: 'Amount must be greater than 0' });
      return;
    }

    setIsExecuting(true);
    try {
      const contract = await getContractWithSigner();
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.executePayment(recipient, amountWei, reason);
      const receipt = await tx.wait();
      setResult({ 
        status: 'success', 
        message: 'Payment Executed Successfully',
        hash: receipt.hash 
      });
      setRecipient('');
      setAmount('');
      setReason('');
    } catch (err) {
      setResult({ 
        status: 'error', 
        message: err.reason || err.message 
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="panel" style={{ border: '1px solid var(--accent-neon)' }}>
      <h2 className="panel-title" style={{ color: 'var(--accent-neon)' }}>AGENT SIMULATOR PANEL</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Current Account: <span style={{fontFamily: 'var(--font-data)'}}>{account || 'NOT CONNECTED'}</span>
      </p>

      <form onSubmit={handleExecute}>
        <div className="form-group">
          <label>Recipient Address</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="0x..." 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Amount (ETH)</label>
          <input 
            type="number" 
            step="any" 
            className="form-control" 
            placeholder="0.0" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Reason / Context</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. API Access Fee" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn" disabled={isExecuting || !recipient || !amount || !account}>
          {isExecuting ? <><span className="spinner"></span>EXECUTING</> : 'EXECUTE PAYMENT'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderLeft: `4px solid ${result.status === 'success' ? 'var(--accent-neon)' : 'var(--danger-neon)'}`,
          background: 'rgba(0,0,0,0.5)'
        }}>
          <h4 style={{ color: result.status === 'success' ? 'var(--accent-neon)' : 'var(--danger-neon)' }}>
            {result.status === 'success' ? 'SUCCESS' : 'BLOCKED'}
          </h4>
          <p>{result.message}</p>
          {result.hash && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <a 
                href={`https://sepolia.etherscan.io/tx/${result.hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-neon)', textDecoration: 'none' }}
              >
                View on Etherscan ↗
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentSimulator;
