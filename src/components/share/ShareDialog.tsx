/**
 * Share Dialog Component
 *
 * Dialog for publishing and sharing LDL documents or design systems.
 * Allows setting a custom slug and copying the shareable URL.
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import {
  Loader2,
  Copy,
  Check,
  Globe,
  Lock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

// =============================================================================
// Types
// =============================================================================

export interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Type of content being shared */
  type: 'ldl' | 'design-system';
  /** Name of the content being shared */
  name: string;
  /** Current publish state */
  isPublished: boolean;
  /** Current slug if published */
  currentSlug?: string;
  /** Called when user wants to publish */
  onPublish: (slug: string) => Promise<boolean>;
  /** Called when user wants to unpublish */
  onUnpublish: () => Promise<boolean>;
  /** Function to check if a slug is available */
  checkSlugAvailable: (slug: string) => Promise<boolean>;
}

// =============================================================================
// Helper Functions
// =============================================================================

function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function getShareUrl(type: 'ldl' | 'design-system', slug: string): string {
  const baseUrl = window.location.origin;
  const path = type === 'ldl' ? 'tokens' : 'systems';
  return `${baseUrl}/${path}/${slug}`;
}

// =============================================================================
// Component
// =============================================================================

export function ShareDialog({
  open,
  onOpenChange,
  type,
  name,
  isPublished,
  currentSlug,
  onPublish,
  onUnpublish,
  checkSlugAvailable,
}: ShareDialogProps) {
  const { isAuthenticated } = useAuthContext();
  const [slug, setSlug] = useState(currentSlug || generateSlugFromName(name));
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSlug(currentSlug || generateSlugFromName(name));
      setIsAvailable(isPublished ? true : null);
      setError(null);
      setCopied(false);
    }
  }, [open, currentSlug, name, isPublished]);

  // Check slug availability when it changes
  useEffect(() => {
    if (!slug || isPublished) return;

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        const available = await checkSlugAvailable(slug);
        setIsAvailable(available);
      } catch {
        setIsAvailable(null);
      }
      setIsChecking(false);
    };

    const timeout = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeout);
  }, [slug, checkSlugAvailable, isPublished]);

  const handlePublish = async () => {
    if (!slug || isAvailable === false) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await onPublish(slug);
      if (success) {
        setIsAvailable(true);
      } else {
        setError('Failed to publish. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    }

    setIsLoading(false);
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await onUnpublish();
      if (!success) {
        setError('Failed to unpublish. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish');
    }

    setIsLoading(false);
  };

  const handleCopyUrl = async () => {
    const url = getShareUrl(type, slug);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSlugChange = (value: string) => {
    // Only allow lowercase letters, numbers, and hyphens
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 50);
    setSlug(sanitized);
    setIsAvailable(null);
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to Share</DialogTitle>
            <DialogDescription>
              You need to be signed in to publish and share your{' '}
              {type === 'ldl' ? 'token documents' : 'design systems'}.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sign in with Google or GitHub to enable cloud sync and sharing
              features.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const shareUrl = getShareUrl(type, slug);
  const typeLabel = type === 'ldl' ? 'Token Document' : 'Design System';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPublished ? (
              <>
                <Globe className="h-5 w-5 text-green-500" />
                Published
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Share {typeLabel}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? `"${name}" is publicly accessible via the link below.`
              : `Publish "${name}" with a custom URL to share it with others.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Slug Input */}
          <div className="space-y-2">
            <Label htmlFor="slug">Custom URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {window.location.origin}/{type === 'ldl' ? 'tokens' : 'systems'}/
              </span>
              <div className="relative flex-1">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-tokens"
                  disabled={isPublished || isLoading}
                  className="pr-8"
                />
                {isChecking && (
                  <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!isChecking && isAvailable === true && !isPublished && (
                  <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {!isChecking && isAvailable === false && (
                  <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {!isChecking && isAvailable === false && (
              <p className="text-sm text-destructive">
                This URL is already taken. Please choose a different one.
              </p>
            )}
          </div>

          {/* Published URL */}
          {isPublished && (
            <div className="space-y-2">
              <Label>Shareable Link</Label>
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareUrl, '_blank')}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Visibility:</span>
            <Badge variant={isPublished ? 'default' : 'secondary'}>
              {isPublished ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isPublished ? (
            <>
              <Button
                variant="outline"
                onClick={handleUnpublish}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Make Private
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isLoading || !slug || isAvailable === false}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4 mr-2" />
                )}
                Publish
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
