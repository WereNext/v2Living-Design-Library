/**
 * Documentation Hook
 *
 * Manages component documentation with support for both
 * local storage and Supabase backends.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ComponentDocumentation } from '../types/documentation';
import { useServices } from '../services';
import type { DocumentationCreate, IDocumentationService } from '../services/types';
import type { LocalDocumentationService } from '../services/local/LocalDocumentationService';

// =============================================================================
// Types
// =============================================================================

interface UseDocumentationReturn {
  /** All documentation entries */
  documentation: ComponentDocumentation[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Get documentation for a specific component */
  getDocumentation: (componentId: string) => ComponentDocumentation | undefined;
  /** Create or update documentation */
  saveDocumentation: (doc: Omit<ComponentDocumentation, 'id' | 'lastUpdated'>) => Promise<void>;
  /** Delete documentation */
  deleteDocumentation: (componentId: string) => Promise<void>;
  /** Update a specific field */
  updateField: (
    componentId: string,
    field: keyof ComponentDocumentation,
    value: ComponentDocumentation[keyof ComponentDocumentation]
  ) => Promise<void>;
  /** Add a custom section */
  addCustomSection: (componentId: string, title: string, content?: string) => Promise<void>;
  /** Remove a custom section */
  removeCustomSection: (componentId: string, sectionIndex: number) => Promise<void>;
  /** Add a code example */
  addCodeExample: (
    componentId: string,
    example: Omit<NonNullable<ComponentDocumentation['codeExamples']>[0], 'id'>
  ) => Promise<void>;
  /** Remove a code example */
  removeCodeExample: (componentId: string, exampleId: string) => Promise<void>;
  /** Export all documentation as JSON file */
  exportAllDocumentation: () => void;
  /** Import documentation from JSON string */
  importDocumentation: (json: string) => Promise<boolean>;
  /** Generate markdown documentation for a component */
  generateMarkdown: (componentId: string) => string;
  /** Refresh documentation from service */
  refresh: () => Promise<void>;
}

// =============================================================================
// Helper to check if service supports saveByComponentId
// =============================================================================

function hasExtendedMethods(
  service: IDocumentationService
): service is IDocumentationService & LocalDocumentationService {
  return 'saveByComponentId' in service;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useDocumentation(): UseDocumentationReturn {
  const { documentation: service, isAuthenticated } = useServices();
  const [documentation, setDocumentation] = useState<ComponentDocumentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load documentation on mount and when auth changes
  const loadDocumentation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await service.getAll();

    if (result.error) {
      setError(result.error);
      setDocumentation([]);
    } else {
      setDocumentation(result.data || []);
    }

    setIsLoading(false);
  }, [service]);

  useEffect(() => {
    loadDocumentation();
  }, [loadDocumentation, isAuthenticated]);

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  const getDocumentation = useCallback(
    (componentId: string): ComponentDocumentation | undefined => {
      return documentation.find((doc) => doc.componentId === componentId);
    },
    [documentation]
  );

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  const saveDocumentation = useCallback(
    async (doc: Omit<ComponentDocumentation, 'id' | 'lastUpdated'>): Promise<void> => {
      const existing = documentation.find((d) => d.componentId === doc.componentId);

      const createData: DocumentationCreate = {
        componentId: doc.componentId,
        componentName: doc.componentName,
        overview: doc.overview,
        whenToUse: doc.whenToUse,
        bestPractices: doc.bestPractices,
        accessibility: doc.accessibility,
        designNotes: doc.designNotes,
        codeExamples: doc.codeExamples,
        customSections: doc.customSections,
        author: doc.author,
        tags: doc.tags,
      };

      if (existing) {
        // Update existing
        const result = await service.update(existing.id, doc);
        if (result.error) {
          console.error('Failed to update documentation:', result.error);
          return;
        }
        if (result.data) {
          setDocumentation((prev) =>
            prev.map((d) => (d.id === existing.id ? result.data! : d))
          );
        }
      } else {
        // Create new
        const result = await service.create(createData);
        if (result.error) {
          console.error('Failed to create documentation:', result.error);
          return;
        }
        if (result.data) {
          setDocumentation((prev) => [...prev, result.data!]);
        }
      }
    },
    [service, documentation]
  );

  const deleteDocumentation = useCallback(
    async (componentId: string): Promise<void> => {
      const doc = documentation.find((d) => d.componentId === componentId);
      if (!doc) return;

      const result = await service.delete(doc.id);
      if (result.error) {
        console.error('Failed to delete documentation:', result.error);
        return;
      }

      setDocumentation((prev) => prev.filter((d) => d.componentId !== componentId));
    },
    [service, documentation]
  );

  const updateField = useCallback(
    async (
      componentId: string,
      field: keyof ComponentDocumentation,
      value: ComponentDocumentation[keyof ComponentDocumentation]
    ): Promise<void> => {
      const doc = documentation.find((d) => d.componentId === componentId);
      if (!doc) return;

      const result = await service.update(doc.id, { [field]: value });
      if (result.error) {
        console.error('Failed to update field:', result.error);
        return;
      }

      if (result.data) {
        setDocumentation((prev) =>
          prev.map((d) => (d.id === doc.id ? result.data! : d))
        );
      }
    },
    [service, documentation]
  );

  // ==========================================================================
  // Custom Sections
  // ==========================================================================

  const addCustomSection = useCallback(
    async (componentId: string, title: string, content: string = ''): Promise<void> => {
      const doc = documentation.find((d) => d.componentId === componentId);
      if (!doc) return;

      const customSections = doc.customSections || [];
      const result = await service.update(doc.id, {
        customSections: [...customSections, { title, content }],
      });

      if (result.error) {
        console.error('Failed to add custom section:', result.error);
        return;
      }

      if (result.data) {
        setDocumentation((prev) =>
          prev.map((d) => (d.id === doc.id ? result.data! : d))
        );
      }
    },
    [service, documentation]
  );

  const removeCustomSection = useCallback(
    async (componentId: string, sectionIndex: number): Promise<void> => {
      const doc = documentation.find((d) => d.componentId === componentId);
      if (!doc || !doc.customSections) return;

      const result = await service.update(doc.id, {
        customSections: doc.customSections.filter((_, i) => i !== sectionIndex),
      });

      if (result.error) {
        console.error('Failed to remove custom section:', result.error);
        return;
      }

      if (result.data) {
        setDocumentation((prev) =>
          prev.map((d) => (d.id === doc.id ? result.data! : d))
        );
      }
    },
    [service, documentation]
  );

  // ==========================================================================
  // Code Examples
  // ==========================================================================

  const addCodeExample = useCallback(
    async (
      componentId: string,
      example: Omit<NonNullable<ComponentDocumentation['codeExamples']>[0], 'id'>
    ): Promise<void> => {
      const doc = documentation.find((d) => d.componentId === componentId);
      if (!doc) return;

      const codeExamples = doc.codeExamples || [];
      const result = await service.update(doc.id, {
        codeExamples: [...codeExamples, { ...example, id: `ex-${Date.now()}` }],
      });

      if (result.error) {
        console.error('Failed to add code example:', result.error);
        return;
      }

      if (result.data) {
        setDocumentation((prev) =>
          prev.map((d) => (d.id === doc.id ? result.data! : d))
        );
      }
    },
    [service, documentation]
  );

  const removeCodeExample = useCallback(
    async (componentId: string, exampleId: string): Promise<void> => {
      const doc = documentation.find((d) => d.componentId === componentId);
      if (!doc || !doc.codeExamples) return;

      const result = await service.update(doc.id, {
        codeExamples: doc.codeExamples.filter((ex) => ex.id !== exampleId),
      });

      if (result.error) {
        console.error('Failed to remove code example:', result.error);
        return;
      }

      if (result.data) {
        setDocumentation((prev) =>
          prev.map((d) => (d.id === doc.id ? result.data! : d))
        );
      }
    },
    [service, documentation]
  );

  // ==========================================================================
  // Import/Export
  // ==========================================================================

  const exportAllDocumentation = useCallback(() => {
    const blob = new Blob([JSON.stringify(documentation, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component-documentation.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [documentation]);

  const importDocumentation = useCallback(
    async (json: string): Promise<boolean> => {
      try {
        const imported = JSON.parse(json);
        if (!Array.isArray(imported)) return false;

        // Import each documentation entry
        for (const doc of imported) {
          if (doc.componentId && doc.componentName) {
            await saveDocumentation(doc);
          }
        }

        // Refresh to get the latest state
        await loadDocumentation();
        return true;
      } catch {
        return false;
      }
    },
    [saveDocumentation, loadDocumentation]
  );

  // ==========================================================================
  // Markdown Generation
  // ==========================================================================

  const generateMarkdown = useCallback(
    (componentId: string): string => {
      const doc = getDocumentation(componentId);
      if (!doc) return '';

      let markdown = `# ${doc.componentName}\n\n`;

      if (doc.overview) {
        markdown += `## Overview\n\n${doc.overview}\n\n`;
      }

      if (doc.whenToUse) {
        markdown += `## When to Use\n\n${doc.whenToUse}\n\n`;
      }

      if (doc.bestPractices && doc.bestPractices.length > 0) {
        markdown += `## Best Practices\n\n`;
        doc.bestPractices.forEach((practice) => {
          markdown += `- ${practice}\n`;
        });
        markdown += '\n';
      }

      if (doc.accessibility) {
        markdown += `## Accessibility\n\n${doc.accessibility}\n\n`;
      }

      if (doc.designNotes) {
        markdown += `## Design Notes\n\n${doc.designNotes}\n\n`;
      }

      if (doc.codeExamples && doc.codeExamples.length > 0) {
        markdown += `## Code Examples\n\n`;
        doc.codeExamples.forEach((example) => {
          markdown += `### ${example.title}\n\n`;
          if (example.description) {
            markdown += `${example.description}\n\n`;
          }
          markdown += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`;
        });
      }

      if (doc.customSections && doc.customSections.length > 0) {
        doc.customSections.forEach((section) => {
          markdown += `## ${section.title}\n\n${section.content}\n\n`;
        });
      }

      if (doc.tags && doc.tags.length > 0) {
        markdown += `---\n\n**Tags:** ${doc.tags.join(', ')}\n`;
      }

      return markdown;
    },
    [getDocumentation]
  );

  // ==========================================================================
  // Return
  // ==========================================================================

  return useMemo(
    () => ({
      documentation,
      isLoading,
      error,
      getDocumentation,
      saveDocumentation,
      deleteDocumentation,
      updateField,
      addCustomSection,
      removeCustomSection,
      addCodeExample,
      removeCodeExample,
      exportAllDocumentation,
      importDocumentation,
      generateMarkdown,
      refresh: loadDocumentation,
    }),
    [
      documentation,
      isLoading,
      error,
      getDocumentation,
      saveDocumentation,
      deleteDocumentation,
      updateField,
      addCustomSection,
      removeCustomSection,
      addCodeExample,
      removeCodeExample,
      exportAllDocumentation,
      importDocumentation,
      generateMarkdown,
      loadDocumentation,
    ]
  );
}
