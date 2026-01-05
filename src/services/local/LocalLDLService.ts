/**
 * Local Storage LDL Documents Service
 *
 * Implements the LDL documents service using localStorage.
 */

import {
  ILDLDocumentsService,
  ServiceResult,
  LDLDocumentCreate,
  LDLDocumentWithMeta,
  success,
  failure,
  withErrorHandling,
} from '../types';
import { STORAGE_KEYS } from '../../lib/constants';

export class LocalLDLService implements ILDLDocumentsService {
  private readonly storageKey = STORAGE_KEYS.LDL_DOCUMENTS;

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<LDLDocumentWithMeta[]>> {
    return withErrorHandling(async () => {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }, true);
  }

  async getById(id: string): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      const doc = result.data?.find((d) => d.id === id);
      if (!doc) throw new Error(`LDL document not found: ${id}`);

      return doc;
    }, true);
  }

  async getByDesignSystem(
    systemId: string
  ): Promise<ServiceResult<LDLDocumentWithMeta[]>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      return (result.data || []).filter((d) => d.designSystemId === systemId);
    }, true);
  }

  async getPublic(): Promise<ServiceResult<LDLDocumentWithMeta[]>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      return (result.data || []).filter((d) => d.isPublic);
    }, true);
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(
    data: LDLDocumentCreate
  ): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      const now = new Date().toISOString();
      const newDoc: LDLDocumentWithMeta = {
        // LDL Token Document fields
        $schema: 'https://ldl.dev/schema/v1',
        $name: data.name,
        $description: data.description,
        $version: data.version,
        color: data.color,
        space: data.space,
        radius: data.radius,
        shadow: data.shadow,
        font: data.font,
        duration: data.duration,
        ease: data.ease,
        component: data.component,
        mode: data.mode,
        // Metadata
        id: `ldl-${Date.now()}`,
        designSystemId: data.designSystemId,
        isPublic: false,
        createdAt: now,
        updatedAt: now,
      };

      docs.push(newDoc);
      localStorage.setItem(this.storageKey, JSON.stringify(docs));

      return newDoc;
    }, true);
  }

  async update(
    id: string,
    data: Partial<LDLDocumentCreate>
  ): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      const index = docs.findIndex((d) => d.id === id);
      if (index === -1) throw new Error(`LDL document not found: ${id}`);

      const updated: LDLDocumentWithMeta = {
        ...docs[index],
        $name: data.name ?? docs[index].$name,
        $description: data.description ?? docs[index].$description,
        $version: data.version ?? docs[index].$version,
        color: data.color ?? docs[index].color,
        space: data.space ?? docs[index].space,
        radius: data.radius ?? docs[index].radius,
        shadow: data.shadow ?? docs[index].shadow,
        font: data.font ?? docs[index].font,
        duration: data.duration ?? docs[index].duration,
        ease: data.ease ?? docs[index].ease,
        component: data.component ?? docs[index].component,
        mode: data.mode ?? docs[index].mode,
        designSystemId: data.designSystemId ?? docs[index].designSystemId,
        updatedAt: new Date().toISOString(),
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
  // Sharing Operations
  // ==========================================================================

  async publish(
    id: string,
    slug: string
  ): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      const index = docs.findIndex((d) => d.id === id);
      if (index === -1) throw new Error(`LDL document not found: ${id}`);

      // Check slug availability
      const slugTaken = docs.some(
        (d) => d.shareSlug === slug && d.id !== id
      );
      if (slugTaken) throw new Error(`Slug already in use: ${slug}`);

      docs[index] = {
        ...docs[index],
        isPublic: true,
        shareSlug: slug,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(docs));
      return docs[index];
    }, true);
  }

  async unpublish(id: string): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const docs = result.data || [];

      const index = docs.findIndex((d) => d.id === id);
      if (index === -1) throw new Error(`LDL document not found: ${id}`);

      docs[index] = {
        ...docs[index],
        isPublic: false,
        shareSlug: undefined,
        publishedAt: undefined,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(docs));
      return docs[index];
    }, true);
  }

  async getBySlug(slug: string): Promise<ServiceResult<LDLDocumentWithMeta>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      const doc = result.data?.find((d) => d.shareSlug === slug && d.isPublic);
      if (!doc) throw new Error(`LDL document not found with slug: ${slug}`);

      return doc;
    }, true);
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    const result = await this.getAll();
    if (result.error) return true;

    return !result.data?.some((d) => d.shareSlug === slug);
  }
}
