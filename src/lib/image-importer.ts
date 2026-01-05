/**
 * Image Importer
 * 
 * Handles importing images from Figma and storing them locally
 * Supports base64 encoding and IndexedDB storage
 */

import type { ImportedImage, ComponentNode } from '../types/imported-component';
import { FigmaAPI } from './figma-api';

export class ImageImporter {
  /**
   * Import all images from a component structure
   */
  async importFromComponent(
    component: ComponentNode,
    fileKey: string,
    figmaAPI: FigmaAPI
  ): Promise<ImportedImage[]> {
    // Extract all image nodes
    const imageNodes = this.extractImageNodes(component);
    if (imageNodes.length === 0) return [];

    // Get image URLs from Figma
    const nodeIds = imageNodes.map(node => node.id);
    const imageUrls = await figmaAPI.getImages(fileKey, nodeIds, {
      format: 'png',
      scale: 2,
    });

    // Download and process each image
    const images: ImportedImage[] = [];
    
    for (const node of imageNodes) {
      const url = imageUrls[node.id];
      if (!url) continue;

      try {
        const image = await this.downloadImage(node.id, node.name, url);
        image.usedInNodes = [node.id];
        images.push(image);
      } catch (error) {
        console.error(`Failed to download image ${node.id}:`, error);
      }
    }

    return images;
  }

  /**
   * Download single image from URL
   */
  async downloadImage(
    id: string,
    name: string,
    url: string
  ): Promise<ImportedImage> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // Get dimensions
    const dimensions = await this.getImageDimensions(blob);
    
    // Convert to base64
    const base64 = await this.blobToBase64(blob);
    
    // Detect format
    const format = this.detectFormat(blob.type);

    return {
      id,
      name: this.sanitizeName(name),
      figmaUrl: url,
      localPath: base64,
      format,
      width: dimensions.width,
      height: dimensions.height,
      size: blob.size,
      usedInNodes: [],
      optimized: false,
    };
  }

  /**
   * Extract all image nodes from component tree
   */
  private extractImageNodes(node: ComponentNode): ComponentNode[] {
    const images: ComponentNode[] = [];

    if (node.type === 'image' || node.props.imageSrc) {
      images.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        images.push(...this.extractImageNodes(child));
      }
    }

    return images;
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Get image dimensions
   */
  private getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * Detect image format from MIME type
   */
  private detectFormat(mimeType: string): ImportedImage['format'] {
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
    if (mimeType.includes('svg')) return 'svg';
    if (mimeType.includes('webp')) return 'webp';
    if (mimeType.includes('gif')) return 'gif';
    return 'png'; // Default
  }

  /**
   * Sanitize image name for use as filename
   */
  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      || 'image';
  }

  /**
   * Generate thumbnail from image
   */
  async generateThumbnail(
    image: ImportedImage,
    maxSize: number = 200
  ): Promise<string> {
    if (!image.localPath) return '';

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate scaled dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = image.localPath;
    });
  }

  /**
   * Optimize image (reduce quality/size)
   */
  async optimizeImage(
    image: ImportedImage,
    quality: number = 0.85
  ): Promise<string> {
    if (!image.localPath || image.format === 'svg') {
      return image.localPath || '';
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        
        const format = image.format === 'png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(format, quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = image.localPath;
    });
  }

  /**
   * Get total size of all images
   */
  getTotalSize(images: ImportedImage[]): number {
    return images.reduce((total, img) => total + (img.size || 0), 0);
  }

  /**
   * Format bytes to readable string
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * IndexedDB Storage for large images (alternative to base64)
 */
export class ImageDBStorage {
  private dbName = 'FigmaImagesDB';
  private storeName = 'images';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async saveImage(id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(blob, id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
