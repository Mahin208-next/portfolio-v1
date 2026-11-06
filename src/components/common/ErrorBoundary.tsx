import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear potentially corrupt cached state
      const keys = Object.keys(localStorage).filter((k) => k.includes('portfolio'));
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto text-yellow-400 font-mono text-xl">
              !
            </div>
            <h1 className="text-xl font-bold tracking-tight">Something unexpected occurred</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The application encountered a render issue. Clicking below will restore the clean interface.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] font-mono text-zinc-500 bg-zinc-950 p-3 rounded-lg overflow-x-auto text-left max-h-32 border border-zinc-800/60">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg transition-colors font-mono"
              >
                Reset &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
