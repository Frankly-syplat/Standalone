import React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px' }}>
          <MessageBar messageBarType={MessageBarType.error}>
            <strong>Something went wrong:</strong> {this.state.error?.message || 'Unknown error'}
          </MessageBar>
          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#0078d4', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}