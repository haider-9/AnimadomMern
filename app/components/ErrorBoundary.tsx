import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Here you could also log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-6">
                A component error occurred. This might be due to a temporary issue.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} className="flex-1">
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="flex-1"
                >
                  Refresh Page
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Error Details (Dev)
                  </summary>
                  <div className="mt-2 p-3 bg-muted/10 rounded border text-xs">
                    <div className="font-mono text-destructive mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <pre className="text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div className="mt-2">
                        <div className="font-semibold text-muted-foreground mb-1">Component Stack:</div>
                        <pre className="text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;