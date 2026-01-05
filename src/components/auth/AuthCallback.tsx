/**
 * OAuth Callback Handler
 *
 * This component handles the OAuth redirect callback from providers.
 * It processes the authentication and redirects to the app.
 */

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

type CallbackState = 'processing' | 'success' | 'error';

export function AuthCallback() {
  const [state, setState] = useState<CallbackState>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        setError('Supabase is not configured');
        setState('error');
        return;
      }

      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setState('success');
          // Redirect to home after a brief success message
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          // No session - might be an error in the URL
          const params = new URLSearchParams(window.location.hash.substring(1));
          const errorDescription = params.get('error_description');

          if (errorDescription) {
            throw new Error(errorDescription);
          }

          // No error but no session - just redirect
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setState('error');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        {state === 'processing' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h1 className="text-xl font-semibold">Signing you in...</h1>
            <p className="text-muted-foreground">Please wait while we complete authentication.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <h1 className="text-xl font-semibold">Welcome!</h1>
            <p className="text-muted-foreground">Redirecting you to the app...</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="h-12 w-12 mx-auto text-destructive" />
            <h1 className="text-xl font-semibold">Authentication Failed</h1>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Return to App
            </button>
          </>
        )}
      </div>
    </div>
  );
}
