import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Name of the section for better error messages */
  section?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    console.error(`Error in ${this.props.section || 'component'}:`, error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              {this.props.section
                ? `An error occurred in the ${this.props.section} section.`
                : 'An unexpected error occurred.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {this.state.error && (
              <div className="p-3 rounded-md bg-muted/50 font-mono text-sm overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <Button onClick={this.handleReset} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/** Minimal inline error boundary for smaller sections */
interface InlineErrorFallbackProps {
  error?: Error | null;
  onReset?: () => void;
  message?: string;
}

export function InlineErrorFallback({ error, onReset, message }: InlineErrorFallbackProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md border border-destructive/30 bg-destructive/5 text-sm">
      <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
      <span className="text-destructive/90 flex-1">
        {message || error?.message || 'Something went wrong'}
      </span>
      {onReset && (
        <Button onClick={onReset} variant="ghost" size="sm" className="h-7 px-2">
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
