import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/main.css';

// ── Boot neural canvas OUTSIDE React — safe from StrictMode double-invoke
import { initNeuralCanvas } from './utils/motion.js';
try { initNeuralCanvas(); } catch (e) { console.warn('Neural canvas skipped:', e); }

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary label="APP CRASHED — PLEASE REFRESH">
    <App />
  </ErrorBoundary>
);
