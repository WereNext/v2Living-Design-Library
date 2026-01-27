/**
 * LDL Web Components Token Sync Service
 *
 * Syncs design system tokens from the Living Design Library app
 * to the @living-design-library/components Web Components package.
 */

import { Theme } from '../hooks/useDesignSystems';
import { exportTokens } from '../utils/tokenExporter';

export interface SyncResult {
  success: boolean;
  message: string;
  tokensGenerated?: string;
  error?: string;
}

/**
 * Generate LDL Web Components tokens CSS from a theme
 */
export function generateLDLComponentsTokens(theme: Theme): string {
  return exportTokens('ldl-web-components', { theme });
}

/**
 * Sync tokens to the Web Components package via the MCP server
 * This writes to packages/components/src/styles/tokens.css
 */
export async function syncTokensToComponents(
  theme: Theme,
  serverPort: number | null
): Promise<SyncResult> {
  if (!serverPort) {
    return {
      success: false,
      message: 'MCP server not detected',
      error: 'Cannot sync tokens without a running MCP server'
    };
  }

  const tokensCSS = generateLDLComponentsTokens(theme);

  try {
    const response = await fetch(`http://localhost:${serverPort}/api/sync-component-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokens: tokensCSS,
        themeName: theme.name,
        themeId: theme.id
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        success: false,
        message: 'Failed to sync tokens',
        error: errorData.error || `HTTP ${response.status}`,
        tokensGenerated: tokensCSS
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Tokens synced successfully',
      tokensGenerated: tokensCSS
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to MCP server',
      error: error instanceof Error ? error.message : 'Unknown error',
      tokensGenerated: tokensCSS
    };
  }
}

/**
 * Download tokens file directly (for manual sync)
 */
export function downloadLDLComponentsTokens(theme: Theme): void {
  const tokensCSS = generateLDLComponentsTokens(theme);
  const blob = new Blob([tokensCSS], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ldl-tokens-${theme.id}.css`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy tokens to clipboard for manual use
 */
export async function copyLDLComponentsTokens(theme: Theme): Promise<void> {
  const tokensCSS = generateLDLComponentsTokens(theme);
  await navigator.clipboard.writeText(tokensCSS);
}
