import { useState, useEffect } from 'react';
import { ComponentDocumentation } from '../types/documentation';
import { STORAGE_KEYS } from '../lib/constants';

const STORAGE_KEY = STORAGE_KEYS.COMPONENT_DOCUMENTATION;

export function useDocumentation() {
  const [documentation, setDocumentation] = useState<ComponentDocumentation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever documentation changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documentation));
    } catch (error) {
      console.error('Failed to save documentation:', error);
    }
  }, [documentation]);

  // Get documentation for a specific component
  const getDocumentation = (componentId: string): ComponentDocumentation | undefined => {
    return documentation.find(doc => doc.componentId === componentId);
  };

  // Create or update documentation
  const saveDocumentation = (doc: Omit<ComponentDocumentation, 'id' | 'lastUpdated'>) => {
    const existing = documentation.find(d => d.componentId === doc.componentId);
    
    if (existing) {
      // Update existing
      setDocumentation(prev => prev.map(d => 
        d.componentId === doc.componentId
          ? { ...d, ...doc, lastUpdated: new Date().toISOString() }
          : d
      ));
    } else {
      // Create new
      const newDoc: ComponentDocumentation = {
        ...doc,
        id: `doc-${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };
      setDocumentation(prev => [...prev, newDoc]);
    }
  };

  // Delete documentation
  const deleteDocumentation = (componentId: string) => {
    setDocumentation(prev => prev.filter(d => d.componentId !== componentId));
  };

  // Update specific field
  const updateField = (componentId: string, field: keyof ComponentDocumentation, value: ComponentDocumentation[keyof ComponentDocumentation]) => {
    setDocumentation(prev => prev.map(doc => 
      doc.componentId === componentId
        ? { ...doc, [field]: value, lastUpdated: new Date().toISOString() }
        : doc
    ));
  };

  // Add custom section
  const addCustomSection = (componentId: string, title: string, content: string = '') => {
    setDocumentation(prev => prev.map(doc => {
      if (doc.componentId === componentId) {
        const customSections = doc.customSections || [];
        return {
          ...doc,
          customSections: [...customSections, { title, content }],
          lastUpdated: new Date().toISOString()
        };
      }
      return doc;
    }));
  };

  // Remove custom section
  const removeCustomSection = (componentId: string, sectionIndex: number) => {
    setDocumentation(prev => prev.map(doc => {
      if (doc.componentId === componentId && doc.customSections) {
        return {
          ...doc,
          customSections: doc.customSections.filter((_, i) => i !== sectionIndex),
          lastUpdated: new Date().toISOString()
        };
      }
      return doc;
    }));
  };

  // Add code example
  const addCodeExample = (componentId: string, example: Omit<ComponentDocumentation['codeExamples'][0], 'id'>) => {
    setDocumentation(prev => prev.map(doc => {
      if (doc.componentId === componentId) {
        const codeExamples = doc.codeExamples || [];
        return {
          ...doc,
          codeExamples: [...codeExamples, { ...example, id: `ex-${Date.now()}` }],
          lastUpdated: new Date().toISOString()
        };
      }
      return doc;
    }));
  };

  // Remove code example
  const removeCodeExample = (componentId: string, exampleId: string) => {
    setDocumentation(prev => prev.map(doc => {
      if (doc.componentId === componentId && doc.codeExamples) {
        return {
          ...doc,
          codeExamples: doc.codeExamples.filter(ex => ex.id !== exampleId),
          lastUpdated: new Date().toISOString()
        };
      }
      return doc;
    }));
  };

  // Export all documentation
  const exportAllDocumentation = () => {
    const blob = new Blob([JSON.stringify(documentation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component-documentation.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import documentation
  const importDocumentation = (json: string) => {
    try {
      const imported = JSON.parse(json);
      if (Array.isArray(imported)) {
        setDocumentation(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Generate markdown documentation for a component
  const generateMarkdown = (componentId: string): string => {
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
      doc.bestPractices.forEach(practice => {
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
      doc.codeExamples.forEach(example => {
        markdown += `### ${example.title}\n\n`;
        if (example.description) {
          markdown += `${example.description}\n\n`;
        }
        markdown += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`;
      });
    }
    
    if (doc.customSections && doc.customSections.length > 0) {
      doc.customSections.forEach(section => {
        markdown += `## ${section.title}\n\n${section.content}\n\n`;
      });
    }
    
    if (doc.tags && doc.tags.length > 0) {
      markdown += `---\n\n**Tags:** ${doc.tags.join(', ')}\n`;
    }
    
    return markdown;
  };

  return {
    documentation,
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
    generateMarkdown
  };
}
