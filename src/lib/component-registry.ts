/**
 * Component Registry
 * 
 * Central registry for all imported components
 * Handles storage, retrieval, and management
 */

import type { ImportedComponent, ComponentFilter, ComponentUpdate } from '../types/imported-component';

export class ComponentRegistry {
  private static STORAGE_KEY = 'imported_components';
  private components: Map<string, ImportedComponent>;

  constructor() {
    this.components = new Map();
    this.loadFromStorage();
  }

  /**
   * Register a new component
   */
  register(component: ImportedComponent): void {
    this.components.set(component.id, component);
    this.saveToStorage();
  }

  /**
   * Get component by ID
   */
  get(id: string): ImportedComponent | undefined {
    return this.components.get(id);
  }

  /**
   * Get all components
   */
  getAll(): ImportedComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by category
   */
  getByCategory(category: string): ImportedComponent[] {
    return this.getAll().filter(c => c.category === category);
  }

  /**
   * Get components by design intent
   */
  getByIntent(intent: string): ImportedComponent[] {
    return this.getAll().filter(c => c.designIntent === intent);
  }

  /**
   * Search components with filters
   */
  search(filter: ComponentFilter): ImportedComponent[] {
    let results = this.getAll();

    if (filter.category) {
      results = results.filter(c => c.category === filter.category);
    }

    if (filter.designIntent) {
      results = results.filter(c => c.designIntent === filter.designIntent);
    }

    if (filter.tags && filter.tags.length > 0) {
      results = results.filter(c =>
        c.tags?.some(tag => filter.tags!.includes(tag))
      );
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }

    return results;
  }

  /**
   * Update component
   */
  update(id: string, updates: ComponentUpdate): boolean {
    const component = this.components.get(id);
    if (!component) return false;

    const updated: ImportedComponent = {
      ...component,
      ...updates,
      metadata: {
        ...component.metadata,
        ...updates.metadata,
        lastEdited: new Date().toISOString(),
      },
    };

    this.components.set(id, updated);
    this.saveToStorage();
    return true;
  }

  /**
   * Delete component
   */
  delete(id: string): boolean {
    const deleted = this.components.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Check if component exists
   */
  has(id: string): boolean {
    return this.components.has(id);
  }

  /**
   * Get component count
   */
  count(): number {
    return this.components.size;
  }

  /**
   * Get statistics
   */
  getStats() {
    const components = this.getAll();
    
    const byCategory = components.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byIntent = components.reduce((acc, c) => {
      if (c.designIntent) {
        acc[c.designIntent] = (acc[c.designIntent] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: components.length,
      byCategory,
      byIntent,
      editable: components.filter(c => c.isEditable).length,
      drafts: components.filter(c => c.isDraft).length,
    };
  }

  /**
   * Export component as JSON
   */
  export(id: string): string | null {
    const component = this.components.get(id);
    if (!component) return null;
    return JSON.stringify(component, null, 2);
  }

  /**
   * Import component from JSON
   */
  import(json: string): ImportedComponent {
    const component = JSON.parse(json) as ImportedComponent;
    
    // Ensure unique ID
    if (this.has(component.id)) {
      component.id = this.generateId();
    }

    this.register(component);
    return component;
  }

  /**
   * Clear all components
   */
  clear(): void {
    this.components.clear();
    this.saveToStorage();
  }

  /**
   * Generate unique ID
   */
  generateId(): string {
    return `component-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.components.entries());
      localStorage.setItem(ComponentRegistry.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save components to storage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(ComponentRegistry.STORAGE_KEY);
      if (data) {
        const entries = JSON.parse(data) as [string, ImportedComponent][];
        this.components = new Map(entries);
      }
    } catch (error) {
      console.error('Failed to load components from storage:', error);
      this.components = new Map();
    }
  }
}

/**
 * Singleton instance
 */
let registryInstance: ComponentRegistry | null = null;

export function getComponentRegistry(): ComponentRegistry {
  if (!registryInstance) {
    registryInstance = new ComponentRegistry();
  }
  return registryInstance;
}
