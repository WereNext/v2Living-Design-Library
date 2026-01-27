/**
 * MCP Bridge Service
 * Syncs design systems and patterns from localStorage to the data bridge file
 * This allows the HTTP MCP server to access live data
 */

import { patternRegistry } from '../patterns';
import type { PatternRegistry } from '../patterns/types';

export interface MCPBridgeData {
  designSystems: any[];
  patterns: PatternRegistry;
  metadata: {
    exportedAt: string;
    exportedFrom: string;
    version: string;
    format: string;
    totalSystems: number;
    totalPatternCategories: number;
  };
}

/**
 * Update the MCP data bridge with current design systems and patterns
 * This writes to the data-bridge.json file that the Vite API endpoint reads
 */
export async function syncToMCPBridge(designSystems: any[]): Promise<void> {
  const data: MCPBridgeData = {
    designSystems,
    patterns: patternRegistry,
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedFrom: 'Living Design Library',
      version: '1.0.0',
      format: 'mcp-sync',
      totalSystems: designSystems.length,
      totalPatternCategories: patternRegistry.categories.length
    }
  };

  // Write to the bridge file using File System Access API (if available)
  // In development, the Vite middleware will serve this data
  try {
    // Store in sessionStorage as a backup for the API endpoint to read
    sessionStorage.setItem('mcp-bridge-data', JSON.stringify(data));

    // Also post to a write endpoint that updates the file
    await fetch('/api/mcp/bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.warn('Could not sync to MCP bridge:', error);
  }
}

/**
 * Get current MCP bridge data from sessionStorage
 */
export function getMCPBridgeData(): MCPBridgeData | null {
  try {
    const data = sessionStorage.getItem('mcp-bridge-data');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Initialize MCP bridge with current design systems from localStorage
 */
export function initializeMCPBridge(): void {
  try {
    const systemsJson = localStorage.getItem('designSystems');
    const systems = systemsJson ? JSON.parse(systemsJson) : [];
    syncToMCPBridge(systems);
  } catch (error) {
    console.error('Failed to initialize MCP bridge:', error);
  }
}
