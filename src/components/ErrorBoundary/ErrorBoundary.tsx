'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    if (
      error.message?.includes('NEXT_NOT_FOUND') ||
      error.message?.includes('404') ||
      error.name === 'NotFoundError'
    ) {
      return { hasError: false };
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (
      error.message?.includes('NEXT_NOT_FOUND') ||
      error.message?.includes('404') ||
      error.name === 'NotFoundError'
    ) {
      return;
    }

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorFallback
            error={this.state.error}
            resetError={() => this.setState({ hasError: false })}
          />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
