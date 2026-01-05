/**
 * User Menu Component
 *
 * Dropdown menu showing user info and actions (sign out, profile, etc.)
 * Shows sign-in button when not authenticated.
 */

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { LogOut, User, Cloud, CloudOff, Settings, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { AuthDialog } from './AuthDialog';

// =============================================================================
// Component
// =============================================================================

export function UserMenu() {
  const { user, isAuthenticated, isLoading, isSupabaseAvailable, signOut } = useAuthContext();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  // Not authenticated - show sign in button
  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAuthDialog(true)}
          className="gap-2"
        >
          {isSupabaseAvailable ? (
            <>
              <Cloud className="h-4 w-4" />
              Sign in
            </>
          ) : (
            <>
              <CloudOff className="h-4 w-4" />
              Local Mode
            </>
          )}
        </Button>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    );
  }

  // Authenticated - show user menu
  const userEmail = user?.email ?? '';
  const userName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? userEmail;
  const userAvatar = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block max-w-[120px] truncate text-sm">
            {userName}
          </span>
          <Badge variant="secondary" className="hidden md:flex text-xs px-1.5 py-0">
            <Cloud className="h-3 w-3 mr-1" />
            Synced
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          Profile
          <Badge variant="outline" className="ml-auto text-xs">Soon</Badge>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          Settings
          <Badge variant="outline" className="ml-auto text-xs">Soon</Badge>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-destructive focus:text-destructive"
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================================
// Compact Version (for mobile/sidebar)
// =============================================================================

export function UserMenuCompact() {
  const { user, isAuthenticated, isLoading, signOut } = useAuthContext();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAuthDialog(true)}
          title="Sign in to sync"
        >
          <CloudOff className="h-5 w-5" />
        </Button>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    );
  }

  const userAvatar = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
  const userName = user?.user_metadata?.full_name ?? user?.email ?? 'User';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-7 w-7">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal truncate">
          {userName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            setIsSigningOut(true);
            await signOut();
            setIsSigningOut(false);
          }}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
