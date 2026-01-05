/**
 * Image Storage
 * 
 * Handles image storage using IndexedDB for large images
 * and localStorage for smaller ones
 */

export interface StoredImage {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  thumbnail?: string;
  uploadedAt: string;
  tags?: string[];
  usageCount?: number;
}

const DB_NAME = 'ImageLibrary';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const THUMBNAIL_STORE = 'thumbnails';
const MAX_LOCALSTORAGE_SIZE = 100 * 1024; // 100KB - use localStorage for smaller images

export class ImageStorage {
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create images store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('uploadedAt', 'uploadedAt', { unique: false });
        }

        // Create thumbnails store
        if (!db.objectStoreNames.contains(THUMBNAIL_STORE)) {
          db.createObjectStore(THUMBNAIL_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Store image
   */
  async store(image: StoredImage): Promise<void> {
    await this.init();

    // Decide storage location based on size
    if (image.size < MAX_LOCALSTORAGE_SIZE) {
      // Small images → localStorage
      this.storeInLocalStorage(image);
    } else {
      // Large images → IndexedDB
      await this.storeInIndexedDB(image);
    }
  }

  /**
   * Get image by ID
   */
  async get(id: string): Promise<StoredImage | null> {
    // Try localStorage first (faster)
    const fromLS = this.getFromLocalStorage(id);
    if (fromLS) return fromLS;

    // Try IndexedDB
    return await this.getFromIndexedDB(id);
  }

  /**
   * Get all images
   */
  async getAll(): Promise<StoredImage[]> {
    const fromLS = this.getAllFromLocalStorage();
    const fromIDB = await this.getAllFromIndexedDB();

    return [...fromLS, ...fromIDB].sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  /**
   * Delete image
   */
  async delete(id: string): Promise<void> {
    // Delete from both locations
    this.deleteFromLocalStorage(id);
    await this.deleteFromIndexedDB(id);
  }

  /**
   * Update image metadata
   */
  async update(id: string, updates: Partial<StoredImage>): Promise<void> {
    const image = await this.get(id);
    if (!image) throw new Error('Image not found');

    const updated = { ...image, ...updates };
    await this.store(updated);
  }

  /**
   * Search images
   */
  async search(query: string): Promise<StoredImage[]> {
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return all.filter(img => 
      img.name.toLowerCase().includes(lowerQuery) ||
      img.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get images by tags
   */
  async getByTags(tags: string[]): Promise<StoredImage[]> {
    const all = await this.getAll();
    
    return all.filter(img => 
      tags.some(tag => img.tags?.includes(tag))
    );
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    total: number;
    totalSize: number;
    byFormat: Record<string, number>;
    inLocalStorage: number;
    inIndexedDB: number;
  }> {
    const all = await this.getAll();
    const fromLS = this.getAllFromLocalStorage();
    const fromIDB = await this.getAllFromIndexedDB();

    const byFormat: Record<string, number> = {};
    let totalSize = 0;

    all.forEach(img => {
      totalSize += img.size;
      byFormat[img.format] = (byFormat[img.format] || 0) + 1;
    });

    return {
      total: all.length,
      totalSize,
      byFormat,
      inLocalStorage: fromLS.length,
      inIndexedDB: fromIDB.length,
    };
  }

  /**
   * Clear all images
   */
  async clear(): Promise<void> {
    // Clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('image_')) {
        localStorage.removeItem(key);
      }
    });

    // Clear IndexedDB
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ===== Private Methods =====

  /**
   * Store in localStorage
   */
  private storeInLocalStorage(image: StoredImage): void {
    try {
      localStorage.setItem(`image_${image.id}`, JSON.stringify(image));
    } catch (error) {
      console.error('Failed to store in localStorage:', error);
      throw error;
    }
  }

  /**
   * Get from localStorage
   */
  private getFromLocalStorage(id: string): StoredImage | null {
    const data = localStorage.getItem(`image_${id}`);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get all from localStorage
   */
  private getAllFromLocalStorage(): StoredImage[] {
    const images: StoredImage[] = [];
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith('image_')) {
        try {
          const data = localStorage.getItem(key);
          if (data) images.push(JSON.parse(data));
        } catch (error) {
          console.error('Failed to parse image:', error);
        }
      }
    });

    return images;
  }

  /**
   * Delete from localStorage
   */
  private deleteFromLocalStorage(id: string): void {
    localStorage.removeItem(`image_${id}`);
  }

  /**
   * Store in IndexedDB
   */
  private async storeInIndexedDB(image: StoredImage): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(image);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get from IndexedDB
   */
  private async getFromIndexedDB(id: string): Promise<StoredImage | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all from IndexedDB
   */
  private async getAllFromIndexedDB(): Promise<StoredImage[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete from IndexedDB
   */
  private async deleteFromIndexedDB(id: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
let instance: ImageStorage | null = null;

export function getImageStorage(): ImageStorage {
  if (!instance) {
    instance = new ImageStorage();
  }
  return instance;
}
