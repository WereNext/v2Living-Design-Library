/**
 * API endpoint for exposing design systems data to MCP HTTP server
 * This allows the MCP server to fetch live data from the React app
 */

export interface MCPDataResponse {
  designSystems: any[];
  metadata: {
    exportedAt: string;
    exportedFrom: string;
    version: string;
    format: string;
    totalSystems: number;
  };
}

/**
 * Get current design systems from localStorage
 */
export function getMCPData(): MCPDataResponse {
  try {
    const systemsJson = localStorage.getItem('designSystems');
    const systems = systemsJson ? JSON.parse(systemsJson) : [];

    return {
      designSystems: systems,
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedFrom: 'Living Design Library',
        version: '1.0.0',
        format: 'mcp-sync',
        totalSystems: systems.length
      }
    };
  } catch (error) {
    console.error('Error getting MCP data:', error);
    return {
      designSystems: [],
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedFrom: 'Living Design Library',
        version: '1.0.0',
        format: 'mcp-sync',
        totalSystems: 0
      }
    };
  }
}
