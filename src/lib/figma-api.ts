/**
 * Figma API Integration
 * 
 * Handles all communication with Figma's REST API
 * for fetching files, nodes, and images
 */

import type { FigmaFile, FigmaNode } from '../types/imported-component';

export class FigmaAPI {
  private baseUrl = 'https://api.figma.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch a complete Figma file
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch specific nodes from a Figma file
   */
  async getNodes(fileKey: string, nodeIds: string[]): Promise<Record<string, { document: FigmaNode }>> {
    const ids = nodeIds.join(',');
    const response = await fetch(
      `${this.baseUrl}/files/${fileKey}/nodes?ids=${ids}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.nodes;
  }

  /**
   * Get image URLs for specific nodes
   */
  async getImages(
    fileKey: string,
    nodeIds: string[],
    options: {
      format?: 'png' | 'jpg' | 'svg' | 'pdf';
      scale?: number;
    } = {}
  ): Promise<Record<string, string>> {
    const { format = 'png', scale = 2 } = options;
    const ids = nodeIds.join(',');
    
    const response = await fetch(
      `${this.baseUrl}/images/${fileKey}?ids=${ids}&format=${format}&scale=${scale}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.images;
  }

  /**
   * Get file metadata (lighter than full file)
   */
  async getFileMetadata(fileKey: string) {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}`, {
      headers: { ...this.getHeaders(), 'X-Figma-Include-Thumbnails': 'true' },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      name: data.name,
      lastModified: data.lastModified,
      thumbnailUrl: data.thumbnailUrl,
      version: data.version,
    };
  }

  /**
   * Extract file key from Figma URL
   */
  static extractFileKey(url: string): string | null {
    const patterns = [
      /figma\.com\/file\/([a-zA-Z0-9]+)/,
      /figma\.com\/design\/([a-zA-Z0-9]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // If it's just the key itself
    if (/^[a-zA-Z0-9]+$/.test(url)) {
      return url;
    }

    return null;
  }

  /**
   * Extract node ID from Figma URL
   */
  static extractNodeId(url: string): string | null {
    const match = url.match(/node-id=([^&]+)/);
    if (match) {
      // Figma URLs use : separator, API uses -
      return match[1].replace(/%3A/g, ':').replace(/-/g, ':');
    }
    
    // If it's just the node ID itself
    if (/^\d+:\d+$/.test(url)) {
      return url;
    }

    return null;
  }

  /**
   * Parse complete Figma URL
   */
  static parseUrl(url: string): { fileKey: string; nodeId?: string } | null {
    const fileKey = this.extractFileKey(url);
    if (!fileKey) return null;

    const nodeId = this.extractNodeId(url);

    return { fileKey, nodeId: nodeId || undefined };
  }

  /**
   * Validate API key format
   */
  static isValidApiKey(key: string): boolean {
    return key.startsWith('figd_') && key.length > 40;
  }

  /**
   * Get request headers
   */
  private getHeaders(): Record<string, string> {
    return {
      'X-Figma-Token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }
}

/**
 * API Key Storage
 */
export class FigmaAPIKeyManager {
  private static STORAGE_KEY = 'figma_api_key';

  static save(apiKey: string): void {
    localStorage.setItem(this.STORAGE_KEY, apiKey);
  }

  static load(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static remove(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static hasKey(): boolean {
    return !!this.load();
  }
}
