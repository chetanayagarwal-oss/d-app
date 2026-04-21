import React, { useState, useEffect } from 'react';
import { getContractWithProvider } from '../utils/contract';
import { ethers } from 'ethers';

function TransactionLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let contract;
    const fetchExistingLogs = async () => {
      try {
        contract = getContractWithProvider();
        const filter = contract.filters.PaymentExecuted();
        const events = await contract.queryFilter(filter, -1000); // last 1000 blocks
        
        const existingLogs = events.map(e => ({
          agent: e.args.agent,
          recipient: e.args.recipient,
          amount: ethers.formatEther(e.args.amount),
          reason: e.args.reason,
          timestamp: Number(e.args.timestamp) * 1000,
          hash: e.transactionHash
        })).reverse();
        
        setLogs(existingLogs);

        // Listen for new events
        contract.on("PaymentExecuted", (agent, recipient, amount, reason, timestamp, event) => {
          const newLog = {
            agent,
            recipient,
            amount: ethers.formatEther(amount),
            reason,
            timestamp: Number(timestamp) * 1000,
            hash: event.log.transactionHash
          };
          setLogs(prev => [newLog, ...prev]);
        });
      } catch (err) {
        console.error("Failed to load logs", err);
      }
    };

    fetchExistingLogs();

    return () => {
      if (contract) {
        contract.removeAllListeners("PaymentExecuted");
      }
    };
  }, []);

  return (
    <div className="panel">
      <h2 className="panel-title">LIVE TRANSACTION LOG</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {logs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No transactions found.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--accent-neon)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                <span className="badge badge-active">{log.amount} ETH</span>
              </div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>FROM:</span> {log.agent} <br />
                <span style={{ color: 'var(--text-muted)' }}>TO:</span> {log.recipient}
              </div>
              <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
                Reason: {log.reason}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionLog;
