import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { crashed: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠</div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: '0.8rem',
            color: 'var(--danger)', letterSpacing: '2px', marginBottom: '0.5rem',
          }}>
            {this.props.label || 'MODULE OFFLINE'}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto',
          }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </div>
          <button
            className="btn btn-sm"
            style={{ marginTop: '1.25rem' }}
            onClick={() => this.setState({ crashed: false, error: null })}
          >
            RETRY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
