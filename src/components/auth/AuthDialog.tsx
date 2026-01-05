/**
 * Authentication Dialog
 *
 * Modal dialog for signing in with GitHub OAuth.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

// =============================================================================
// Icons
// =============================================================================

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

// =============================================================================
// Component
// =============================================================================

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signInWithOAuth, isSupabaseAvailable } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await signInWithOAuth('github');

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
    // Note: On success, the page will redirect to OAuth provider
  };

  if (!isSupabaseAvailable) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cloud Sync Not Available</DialogTitle>
            <DialogDescription>
              Cloud sync is not configured for this instance. Your data is stored
              locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To enable cloud sync, configure Supabase environment variables.
              See the documentation for setup instructions.
            </AlertDescription>
          </Alert>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Continue Locally
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to sync your designs</DialogTitle>
          <DialogDescription>
            Sign in to save your design systems to the cloud, access them from
            anywhere, and share them with your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GitHubIcon className="mr-2 h-5 w-5" />
            )}
            Continue with GitHub
          </Button>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground text-center">
            You can continue using the app without signing in.
            <br />
            Your data will be stored locally in your browser.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
