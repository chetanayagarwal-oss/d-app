import React, { useState, useEffect } from 'react';
import { getContractWithProvider } from '../utils/contract';
import { ethers } from 'ethers';

function TransactionLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let contract;
    let cancelled = false;

    const fetchLogs = async () => {
      setLoading(true);
      setOffline(false);
      try {
        // getContractWithProvider throws if no MetaMask — catch it
        contract = getContractWithProvider();

        const filter = contract.filters.PaymentExecuted();
        const events = await contract.queryFilter(filter, -1000);

        if (cancelled) return;

        const fetched = events.map(e => ({
          agent:     e.args.agent,
          recipient: e.args.recipient,
          amount:    ethers.formatEther(e.args.amount),
          reason:    e.args.reason,
          timestamp: Number(e.args.timestamp) * 1000,
          hash:      e.transactionHash,
        })).reverse();

        setLogs(fetched);

        // Live listener
        contract.on('PaymentExecuted', (agent, recipient, amount, reason, timestamp, event) => {
          if (cancelled) return;
          setLogs(prev => [{
            agent, recipient,
            amount:    ethers.formatEther(amount),
            reason,
            timestamp: Number(timestamp) * 1000,
            hash:      event.log.transactionHash,
          }, ...prev]);
        });
      } catch (err) {
        console.warn('TransactionLog: contract not available —', err.message);
        if (!cancelled) setOffline(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLogs();
    return () => {
      cancelled = true;
      try { if (contract?.removeAllListeners) contract.removeAllListeners('PaymentExecuted'); } catch {}
    };
  }, []);

  const short   = (addr) => addr ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : '';
  const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmtDate = (ts) => new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="panel" style={{ height: 'fit-content' }}>
      <h2 className="panel-title">
        <span className="title-icon danger">📡</span>
        LIVE TRANSACTION LOG
        {logs.length > 0 && (
          <span className="badge badge-active" style={{ marginLeft: 'auto', fontSize: '0.6rem' }}>
            {logs.length} TXN{logs.length !== 1 ? 'S' : ''}
          </span>
        )}
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <span className="spinner" style={{ width: '20px', height: '20px' }} />
          <p style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            INDEXING CHAIN DATA…
          </p>
        </div>
      ) : offline ? (
        /* Contract not deployed / wrong network — show graceful message */
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔌</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-muted)' }}>
            CONTRACT NOT DEPLOYED
          </div>
          <div style={{ fontSize: '0.78rem', marginTop: '0.4rem' }}>
            Deploy the contract to Sepolia to see live transactions.
          </div>
        </div>
      ) : (
        <div className="log-list">
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px' }}>
                NO TRANSACTIONS YET
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--text-dim)' }}>
                Execute a payment to see it here live.
              </div>
            </div>
          ) : (
            logs.map((log, i) => (
              <a
                key={i}
                href={`https://sepolia.etherscan.io/tx/${log.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="log-entry"
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="log-entry-header">
                  <span className="log-timestamp">{fmtDate(log.timestamp)} · {fmtTime(log.timestamp)}</span>
                  <span className="badge badge-active">{parseFloat(log.amount).toFixed(6)} ETH</span>
                </div>
                <div className="log-addr"><span>FROM</span> {short(log.agent)}</div>
                <div className="log-addr"><span>&nbsp;&nbsp;TO</span> {short(log.recipient)}</div>
                {log.reason && <div className="log-reason">"{log.reason}"</div>}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionLog;
