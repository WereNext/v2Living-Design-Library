/**
 * ComponentRegistry Unit Tests
 */

import { ComponentRegistry } from '../lib/component-registry';
import type { ImportedComponent } from '../types/imported-component';

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;

  beforeEach(() => {
    localStorage.clear();
    registry = new ComponentRegistry();
  });

  const createMockComponent = (overrides?: Partial<ImportedComponent>): ImportedComponent => ({
    id: 'comp-1',
    name: 'Test Component',
    source: { type: 'figma' },
    category: 'card',
    designIntent: 'e-commerce',
    structure: {
      id: 'node-1',
      name: 'Root',
      type: 'frame',
      props: {},
      styles: {},
    },
    images: [],
    code: { jsx: '', imports: [] },
    metadata: {
      importedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    isEditable: true,
    ...overrides,
  });

  describe('Basic operations', () => {
    test('should register a component', () => {
      const component = createMockComponent();
      registry.register(component);
      
      const retrieved = registry.get(component.id);
      expect(retrieved).toEqual(component);
    });

    test('should get all components', () => {
      const comp1 = createMockComponent({ id: 'comp-1' });
      const comp2 = createMockComponent({ id: 'comp-2' });
      
      registry.register(comp1);
      registry.register(comp2);
      
      const all = registry.getAll();
      expect(all).toHaveLength(2);
      expect(all).toContainEqual(comp1);
      expect(all).toContainEqual(comp2);
    });

    test('should check if component exists', () => {
      const component = createMockComponent();
      
      expect(registry.has(component.id)).toBe(false);
      registry.register(component);
      expect(registry.has(component.id)).toBe(true);
    });

    test('should delete a component', () => {
      const component = createMockComponent();
      registry.register(component);
      
      expect(registry.has(component.id)).toBe(true);
      const deleted = registry.delete(component.id);
      
      expect(deleted).toBe(true);
      expect(registry.has(component.id)).toBe(false);
    });

    test('should return false when deleting non-existent component', () => {
      const deleted = registry.delete('non-existent');
      expect(deleted).toBe(false);
    });

    test('should count components', () => {
      expect(registry.count()).toBe(0);
      
      registry.register(createMockComponent({ id: 'comp-1' }));
      expect(registry.count()).toBe(1);
      
      registry.register(createMockComponent({ id: 'comp-2' }));
      expect(registry.count()).toBe(2);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      registry.register(createMockComponent({ 
        id: 'hero-1', 
        category: 'hero',
        designIntent: 'landing-page',
      }));
      registry.register(createMockComponent({ 
        id: 'card-1', 
        category: 'card',
        designIntent: 'e-commerce',
      }));
      registry.register(createMockComponent({ 
        id: 'card-2', 
        category: 'card',
        designIntent: 'e-commerce',
      }));
      registry.register(createMockComponent({ 
        id: 'button-1', 
        category: 'button',
        designIntent: 'landing-page',
      }));
    });

    test('should filter by category', () => {
      const cards = registry.getByCategory('card');
      expect(cards).toHaveLength(2);
      expect(cards.every(c => c.category === 'card')).toBe(true);
    });

    test('should filter by design intent', () => {
      const landing = registry.getByIntent('landing-page');
      expect(landing).toHaveLength(2);
      expect(landing.every(c => c.designIntent === 'landing-page')).toBe(true);
    });

    test('should search with multiple filters', () => {
      const results = registry.search({
        category: 'card',
        designIntent: 'e-commerce',
      });
      
      expect(results).toHaveLength(2);
      expect(results.every(c => 
        c.category === 'card' && c.designIntent === 'e-commerce'
      )).toBe(true);
    });

    test('should search by name', () => {
      registry.register(createMockComponent({ 
        id: 'special',
        name: 'Special Hero Component',
        category: 'hero',
      }));
      
      const results = registry.search({ searchTerm: 'special' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toContain('Special');
    });

    test('should search by description', () => {
      registry.register(createMockComponent({ 
        id: 'desc-test',
        description: 'Amazing product card',
        category: 'card',
      }));
      
      const results = registry.search({ searchTerm: 'amazing' });
      expect(results).toHaveLength(1);
    });

    test('should search by tags', () => {
      registry.register(createMockComponent({ 
        id: 'tagged',
        tags: ['premium', 'featured'],
        category: 'card',
      }));
      
      const results = registry.search({ tags: ['premium'] });
      expect(results).toHaveLength(1);
    });
  });

  describe('Update operations', () => {
    test('should update component', () => {
      const component = createMockComponent();
      registry.register(component);
      
      const success = registry.update(component.id, {
        metadata: { ...component.metadata, version: '2.0.0' },
      });
      
      expect(success).toBe(true);
      
      const updated = registry.get(component.id);
      expect(updated?.metadata.version).toBe('2.0.0');
      expect(updated?.metadata.lastEdited).toBeDefined();
    });

    test('should return false when updating non-existent component', () => {
      const success = registry.update('non-existent', {});
      expect(success).toBe(false);
    });

    test('should preserve unmodified fields on update', () => {
      const component = createMockComponent({ name: 'Original Name' });
      registry.register(component);
      
      registry.update(component.id, {
        metadata: { ...component.metadata, version: '2.0.0' },
      });
      
      const updated = registry.get(component.id);
      expect(updated?.name).toBe('Original Name');
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      registry.register(createMockComponent({ 
        id: '1', 
        category: 'hero',
        designIntent: 'landing-page',
        isEditable: true,
        isDraft: false,
      }));
      registry.register(createMockComponent({ 
        id: '2', 
        category: 'hero',
        designIntent: 'landing-page',
        isEditable: true,
        isDraft: true,
      }));
      registry.register(createMockComponent({ 
        id: '3', 
        category: 'card',
        designIntent: 'e-commerce',
        isEditable: false,
      }));
    });

    test('should calculate statistics', () => {
      const stats = registry.getStats();
      
      expect(stats.total).toBe(3);
      expect(stats.byCategory.hero).toBe(2);
      expect(stats.byCategory.card).toBe(1);
      expect(stats.byIntent['landing-page']).toBe(2);
      expect(stats.byIntent['e-commerce']).toBe(1);
      expect(stats.editable).toBe(2);
      expect(stats.drafts).toBe(1);
    });
  });

  describe('Import/Export', () => {
    test('should export component as JSON', () => {
      const component = createMockComponent();
      registry.register(component);
      
      const json = registry.export(component.id);
      expect(json).toBeDefined();
      
      const parsed = JSON.parse(json!);
      expect(parsed.id).toBe(component.id);
      expect(parsed.name).toBe(component.name);
    });

    test('should return null when exporting non-existent component', () => {
      const json = registry.export('non-existent');
      expect(json).toBeNull();
    });

    test('should import component from JSON', () => {
      const component = createMockComponent();
      const json = JSON.stringify(component);
      
      const imported = registry.import(json);
      
      expect(registry.has(imported.id)).toBe(true);
      expect(imported.name).toBe(component.name);
    });

    test('should generate new ID on import if duplicate', () => {
      const component = createMockComponent({ id: 'duplicate' });
      registry.register(component);
      
      const json = JSON.stringify(component);
      const imported = registry.import(json);
      
      expect(imported.id).not.toBe(component.id);
      expect(registry.count()).toBe(2);
    });
  });

  describe('Persistence', () => {
    test('should save to localStorage on register', () => {
      const component = createMockComponent();
      registry.register(component);
      
      const stored = localStorage.getItem('imported_components');
      expect(stored).toBeDefined();
      
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    test('should load from localStorage on init', () => {
      const component = createMockComponent();
      registry.register(component);
      
      // Create new registry instance
      const newRegistry = new ComponentRegistry();
      
      const retrieved = newRegistry.get(component.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe(component.name);
    });

    test('should save to localStorage on delete', () => {
      const component = createMockComponent();
      registry.register(component);
      registry.delete(component.id);
      
      const stored = localStorage.getItem('imported_components');
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('ID generation', () => {
    test('should generate unique IDs', () => {
      const id1 = registry.generateId();
      const id2 = registry.generateId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^component-\d+-[a-z0-9]+$/);
    });
  });

  describe('Clear', () => {
    test('should clear all components', () => {
      registry.register(createMockComponent({ id: '1' }));
      registry.register(createMockComponent({ id: '2' }));
      
      expect(registry.count()).toBe(2);
      
      registry.clear();
      
      expect(registry.count()).toBe(0);
      expect(registry.getAll()).toHaveLength(0);
    });
  });
});
