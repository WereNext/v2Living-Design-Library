/**
 * LDL Documents Hook
 *
 * Manages LDL (Living Design Library) token documents.
 * Supports both local storage and Supabase backends.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useServices } from '../services';
import type { LDLDocumentWithMeta, LDLDocumentCreate } from '../services/types';
import type { LDLTokenDocument } from '../lib/ldl/types';

// =============================================================================
// Types
// =============================================================================

export interface UseLDLDocumentsReturn {
  /** All LDL documents for the current user */
  documents: LDLDocumentWithMeta[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;

  // CRUD Operations
  /** Create a new LDL document */
  createDocument: (data: LDLDocumentCreate) => Promise<LDLDocumentWithMeta | null>;
  /** Update an existing document */
  updateDocument: (
    id: string,
    data: Partial<LDLDocumentCreate>
  ) => Promise<LDLDocumentWithMeta | null>;
  /** Delete a document */
  deleteDocument: (id: string) => Promise<boolean>;
  /** Get a document by ID */
  getDocument: (id: string) => LDLDocumentWithMeta | undefined;

  // Import/Export
  /** Import from an LDLTokenDocument */
  importFromLDL: (
    doc: LDLTokenDocument,
    name?: string
  ) => Promise<LDLDocumentWithMeta | null>;

  // Sharing
  /** Publish a document with a custom slug */
  publishDocument: (
    id: string,
    slug: string
  ) => Promise<LDLDocumentWithMeta | null>;
  /** Unpublish a document */
  unpublishDocument: (id: string) => Promise<LDLDocumentWithMeta | null>;
  /** Get a public document by slug */
  getPublicDocument: (slug: string) => Promise<LDLDocumentWithMeta | null>;
  /** Check if a slug is available */
  isSlugAvailable: (slug: string) => Promise<boolean>;

  // Refresh
  /** Refresh the documents list */
  refresh: () => Promise<void>;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useLDLDocuments(): UseLDLDocumentsReturn {
  const { ldl: service, isAuthenticated } = useServices();
  const [documents, setDocuments] = useState<LDLDocumentWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load documents on mount and when auth changes
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await service.getAll();

    if (result.error) {
      setError(result.error);
      setDocuments([]);
    } else {
      setDocuments(result.data || []);
    }

    setIsLoading(false);
  }, [service]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments, isAuthenticated]);

  // ==========================================================================
  // CRUD Operations
  // ==========================================================================

  const createDocument = useCallback(
    async (data: LDLDocumentCreate): Promise<LDLDocumentWithMeta | null> => {
      const result = await service.create(data);

      if (result.error) {
        console.error('Failed to create LDL document:', result.error);
        return null;
      }

      if (result.data) {
        setDocuments((prev) => [result.data!, ...prev]);
      }

      return result.data;
    },
    [service]
  );

  const updateDocument = useCallback(
    async (
      id: string,
      data: Partial<LDLDocumentCreate>
    ): Promise<LDLDocumentWithMeta | null> => {
      const result = await service.update(id, data);

      if (result.error) {
        console.error('Failed to update LDL document:', result.error);
        return null;
      }

      if (result.data) {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === id ? result.data! : doc))
        );
      }

      return result.data;
    },
    [service]
  );

  const deleteDocument = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await service.delete(id);

      if (result.error) {
        console.error('Failed to delete LDL document:', result.error);
        return false;
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      return true;
    },
    [service]
  );

  const getDocument = useCallback(
    (id: string): LDLDocumentWithMeta | undefined => {
      return documents.find((doc) => doc.id === id);
    },
    [documents]
  );

  // ==========================================================================
  // Import/Export
  // ==========================================================================

  const importFromLDL = useCallback(
    async (
      doc: LDLTokenDocument,
      name?: string
    ): Promise<LDLDocumentWithMeta | null> => {
      const data: LDLDocumentCreate = {
        name: name || doc.$name || 'Imported Tokens',
        description: doc.$description,
        version: doc.$version,
        color: doc.color,
        space: doc.space,
        radius: doc.radius,
        shadow: doc.shadow,
        font: doc.font,
        duration: doc.duration,
        ease: doc.ease,
        component: doc.component,
        mode: doc.mode,
      };

      return createDocument(data);
    },
    [createDocument]
  );

  // ==========================================================================
  // Sharing
  // ==========================================================================

  const publishDocument = useCallback(
    async (id: string, slug: string): Promise<LDLDocumentWithMeta | null> => {
      const result = await service.publish(id, slug);

      if (result.error) {
        console.error('Failed to publish LDL document:', result.error);
        return null;
      }

      if (result.data) {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === id ? result.data! : doc))
        );
      }

      return result.data;
    },
    [service]
  );

  const unpublishDocument = useCallback(
    async (id: string): Promise<LDLDocumentWithMeta | null> => {
      const result = await service.unpublish(id);

      if (result.error) {
        console.error('Failed to unpublish LDL document:', result.error);
        return null;
      }

      if (result.data) {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === id ? result.data! : doc))
        );
      }

      return result.data;
    },
    [service]
  );

  const getPublicDocument = useCallback(
    async (slug: string): Promise<LDLDocumentWithMeta | null> => {
      const result = await service.getBySlug(slug);

      if (result.error) {
        console.error('Failed to get public LDL document:', result.error);
        return null;
      }

      return result.data;
    },
    [service]
  );

  const isSlugAvailable = useCallback(
    async (slug: string): Promise<boolean> => {
      return service.isSlugAvailable(slug);
    },
    [service]
  );

  // ==========================================================================
  // Return
  // ==========================================================================

  return useMemo(
    () => ({
      documents,
      isLoading,
      error,
      createDocument,
      updateDocument,
      deleteDocument,
      getDocument,
      importFromLDL,
      publishDocument,
      unpublishDocument,
      getPublicDocument,
      isSlugAvailable,
      refresh: loadDocuments,
    }),
    [
      documents,
      isLoading,
      error,
      createDocument,
      updateDocument,
      deleteDocument,
      getDocument,
      importFromLDL,
      publishDocument,
      unpublishDocument,
      getPublicDocument,
      isSlugAvailable,
      loadDocuments,
    ]
  );
}
