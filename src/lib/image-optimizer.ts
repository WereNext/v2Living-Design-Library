/**
 * Image Optimizer
 * 
 * Handles image optimization, compression, and format conversion
 */

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'png' | 'jpeg' | 'webp';
  maintainAspectRatio?: boolean;
}

export interface OptimizedImage {
  dataUrl: string;
  width: number;
  height: number;
  size: number; // bytes
  format: string;
  originalSize: number;
  compressionRatio: number;
}

export class ImageOptimizer {
  /**
   * Optimize an image file
   */
  static async optimize(
    file: File,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 2000,
      maxHeight = 2000,
      quality = 0.85,
      format,
      maintainAspectRatio = true,
    } = options;

    const originalSize = file.size;

    // Load image
    const img = await this.loadImage(file);
    
    // Calculate new dimensions
    let { width, height } = this.calculateDimensions(
      img.width,
      img.height,
      maxWidth,
      maxHeight,
      maintainAspectRatio
    );

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw resized image
    ctx.drawImage(img, 0, 0, width, height);

    // Determine output format
    const outputFormat = format || this.detectBestFormat(file.type);
    const mimeType = this.getMimeType(outputFormat);

    // Convert to data URL
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const optimizedSize = this.getDataUrlSize(dataUrl);

    return {
      dataUrl,
      width,
      height,
      size: optimizedSize,
      format: outputFormat,
      originalSize,
      compressionRatio: originalSize / optimizedSize,
    };
  }

  /**
   * Create thumbnail
   */
  static async createThumbnail(
    file: File,
    size: number = 200
  ): Promise<string> {
    const result = await this.optimize(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      format: 'jpeg',
    });

    return result.dataUrl;
  }

  /**
   * Convert image format
   */
  static async convertFormat(
    dataUrl: string,
    toFormat: 'png' | 'jpeg' | 'webp',
    quality: number = 0.85
  ): Promise<string> {
    const img = await this.loadImageFromDataUrl(dataUrl);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context failed');

    ctx.drawImage(img, 0, 0);

    const mimeType = this.getMimeType(toFormat);
    return canvas.toDataURL(mimeType, quality);
  }

  /**
   * Compress image to target size
   */
  static async compressToSize(
    file: File,
    targetSizeKB: number,
    maxAttempts: number = 10
  ): Promise<OptimizedImage> {
    let quality = 0.9;
    let attempt = 0;
    let result: OptimizedImage;

    do {
      result = await this.optimize(file, { quality });
      attempt++;
      
      if (result.size / 1024 <= targetSizeKB) {
        break;
      }
      
      // Reduce quality for next attempt
      quality -= 0.1;
    } while (attempt < maxAttempts && quality > 0.1);

    return result;
  }

  /**
   * Extract image metadata
   */
  static async getMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    name: string;
    aspectRatio: number;
  }> {
    const img = await this.loadImage(file);

    return {
      width: img.width,
      height: img.height,
      size: file.size,
      type: file.type,
      name: file.name,
      aspectRatio: img.width / img.height,
    };
  }

  /**
   * Validate image file
   */
  static validate(file: File, options: {
    maxSize?: number; // bytes
    allowedFormats?: string[];
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const {
      maxSize = 10 * 1024 * 1024, // 10MB
      allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'],
    } = options;

    // Check file type
    if (!allowedFormats.includes(file.type)) {
      errors.push(`Invalid format. Allowed: ${allowedFormats.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Load image from file
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * Load image from data URL
   */
  private static loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.src = dataUrl;
    });
  }

  /**
   * Calculate new dimensions
   */
  private static calculateDimensions(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
    maintainAspectRatio: boolean
  ): { width: number; height: number } {
    if (!maintainAspectRatio) {
      return {
        width: Math.min(width, maxWidth),
        height: Math.min(height, maxHeight),
      };
    }

    // Don't upscale
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height };
    }

    const aspectRatio = width / height;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  /**
   * Detect best format based on input
   */
  private static detectBestFormat(mimeType: string): 'png' | 'jpeg' | 'webp' {
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpeg';
    if (mimeType.includes('webp')) return 'webp';
    
    // Default to JPEG for best compatibility
    return 'jpeg';
  }

  /**
   * Get MIME type from format
   */
  private static getMimeType(format: 'png' | 'jpeg' | 'webp'): string {
    const mimeTypes = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    };

    return mimeTypes[format];
  }

  /**
   * Calculate data URL size in bytes
   */
  private static getDataUrlSize(dataUrl: string): number {
    // Remove data URL prefix
    const base64 = dataUrl.split(',')[1];
    
    // Calculate size
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length * 3 / 4) - padding;
  }

  /**
   * Format file size for display
   */
  static formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}
