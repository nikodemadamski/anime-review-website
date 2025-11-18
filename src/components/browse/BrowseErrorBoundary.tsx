'use client';

import React, { Component, ReactNode } from 'react';
import { trackError } from '@/lib/analytics-events';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class BrowseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to analytics
    trackError(error.message, {
      componentStack: errorInfo.componentStack,
      errorStack: error.stack,
      page: 'browse',
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Browse page error:', error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });
  }

  handleRetry = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Reload the page
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--background)' }}
        >
          <div 
            className="max-w-md w-full p-8 rounded-xl text-center"
            style={{
              backgroundColor: 'var(--card-background)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Error Icon */}
            <div className="text-6xl mb-4">⚠️</div>

            {/* Error Title */}
            <h2 
              className="text-2xl font-bold mb-3"
              style={{ color: 'var(--foreground)' }}
            >
              Oops! Something went wrong
            </h2>

            {/* Error Description */}
            <p 
              className="mb-6"
              style={{ color: 'var(--secondary)' }}
            >
              We're having trouble loading the browse page. This might be a temporary issue.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div 
                className="mb-6 p-4 rounded-lg text-left text-sm overflow-auto max-h-40"
                style={{
                  backgroundColor: 'var(--text-block)',
                  color: 'var(--error)',
                }}
              >
                <p className="font-mono text-xs break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 px-6 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#FFFFFF',
                }}
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-6 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: 'var(--card-background)',
                  color: 'var(--foreground)',
                  borderWidth: '2px',
                  borderColor: 'var(--border)',
                }}
              >
                Go Home
              </button>
            </div>

            {/* Help Text */}
            <p 
              className="mt-6 text-sm"
              style={{ color: 'var(--secondary)' }}
            >
              If the problem persists, please contact support or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
