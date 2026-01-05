/**
 * Local Storage Documentation Service
 *
 * Implements the documentation service using localStorage.
 */

import {
  IDocumentationService,
  ServiceResult,
  DocumentationCreate,
  success,
  failure,
  withErrorHandling,
} from '../types';
import { ComponentDocumentation } from '../../types/documentation';
import { STORAGE_KEYS } from '../../lib/constants';

export class LocalDocumentationService implements IDocumentationService {
  private readonly storageKey = STORAGE_KEYS.COMPONENT_DOCUMENTATION;

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<ComponentDocumentation[]>> {
    return withErrorHandling(async () => {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }, true);
  }

  async getById(id: string): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      const doc = result.data?.find((d) => d.id === id);
      if (!doc) throw new Error(`Documentation not found: ${id}`);

      return doc;
    }, true);
  }

  async getByComponentId(
    componentId: string
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      const doc = result.data?.find((d) => d.componentId === componentId);
      if (!doc) throw new Error(`Documentation not found for component: ${componentId}`);

      return doc;
    }, true);
  }

  async getByDesignSystem(
    systemId: string
  ): Promise<ServiceResult<ComponentDocumentation[]>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      // Filter by design system if the documentation has that field
      return (result.data || []).filter(
        (d) => (d as ComponentDocumentation & { designSystemId?: string }).designSystemId === systemId
      );
    }, true);
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(
    data: DocumentationCreate
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      // Check if documentation already exists for this component
      const existing = docs.find((d) => d.componentId === data.componentId);
      if (existing) {
        throw new Error(`Documentation already exists for component: ${data.componentId}`);
      }

      const now = new Date().toISOString();
      const newDoc: ComponentDocumentation = {
        id: `doc-${Date.now()}`,
        componentId: data.componentId,
        componentName: data.componentName,
        overview: data.overview,
        whenToUse: data.whenToUse,
        bestPractices: data.bestPractices || [],
        accessibility: data.accessibility,
        designNotes: data.designNotes,
        codeExamples: data.codeExamples || [],
        customSections: data.customSections || [],
        author: data.author,
        tags: data.tags || [],
        lastUpdated: now,
      };

      docs.push(newDoc);
      localStorage.setItem(this.storageKey, JSON.stringify(docs));

      return newDoc;
    }, true);
  }

  async update(
    id: string,
    data: Partial<ComponentDocumentation>
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      const index = docs.findIndex((d) => d.id === id);
      if (index === -1) throw new Error(`Documentation not found: ${id}`);

      const updated: ComponentDocumentation = {
        ...docs[index],
        ...data,
        id: docs[index].id, // Preserve ID
        componentId: docs[index].componentId, // Preserve component ID
        lastUpdated: new Date().toISOString(),
      };

      docs[index] = updated;
      localStorage.setItem(this.storageKey, JSON.stringify(docs));

      return updated;
    }, true);
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = (result.data || []).filter((d) => d.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(docs));
      return true;
    }, true);
  }

  // ==========================================================================
  // Additional Methods
  // ==========================================================================

  /**
   * Save or update documentation by component ID
   * If documentation exists, updates it; otherwise creates new
   */
  async saveByComponentId(
    data: DocumentationCreate
  ): Promise<ServiceResult<ComponentDocumentation>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      const existingIndex = docs.findIndex((d) => d.componentId === data.componentId);
      const now = new Date().toISOString();

      if (existingIndex !== -1) {
        // Update existing
        const updated: ComponentDocumentation = {
          ...docs[existingIndex],
          componentName: data.componentName,
          overview: data.overview,
          whenToUse: data.whenToUse,
          bestPractices: data.bestPractices || docs[existingIndex].bestPractices,
          accessibility: data.accessibility,
          designNotes: data.designNotes,
          codeExamples: data.codeExamples || docs[existingIndex].codeExamples,
          customSections: data.customSections || docs[existingIndex].customSections,
          author: data.author,
          tags: data.tags || docs[existingIndex].tags,
          lastUpdated: now,
        };

        docs[existingIndex] = updated;
        localStorage.setItem(this.storageKey, JSON.stringify(docs));

        return updated;
      } else {
        // Create new
        const newDoc: ComponentDocumentation = {
          id: `doc-${Date.now()}`,
          componentId: data.componentId,
          componentName: data.componentName,
          overview: data.overview,
          whenToUse: data.whenToUse,
          bestPractices: data.bestPractices || [],
          accessibility: data.accessibility,
          designNotes: data.designNotes,
          codeExamples: data.codeExamples || [],
          customSections: data.customSections || [],
          author: data.author,
          tags: data.tags || [],
          lastUpdated: now,
        };

        docs.push(newDoc);
        localStorage.setItem(this.storageKey, JSON.stringify(docs));

        return newDoc;
      }
    }, true);
  }

  /**
   * Delete documentation by component ID
   */
  async deleteByComponentId(componentId: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = (result.data || []).filter((d) => d.componentId !== componentId);
      localStorage.setItem(this.storageKey, JSON.stringify(docs));
      return true;
    }, true);
  }
}
