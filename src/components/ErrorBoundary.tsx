import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches render errors from children and
 * displays a friendly fallback UI instead of a blank screen.
 * Must be a class component (React requirement for error boundaries).
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-warm-white">
          <div className="max-w-md w-full mx-4 border border-border rounded-card p-8 bg-warm-white">
            <h1 className="text-teal-dark font-heading text-xl font-semibold mb-2">
              Something went wrong
            </h1>
            <p className="text-muted font-body text-sm mb-4">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error && (
              <pre className="text-muted font-body text-xs bg-warm-white border border-border rounded-card p-3 mb-6 overflow-auto max-h-32 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="bg-teal-dark text-warm-white font-body text-sm font-medium px-4 py-2 rounded-card hover:opacity-90 transition-opacity"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
