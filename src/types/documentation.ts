// Documentation types for component commentary

export interface ComponentDocumentation {
  id: string;
  componentId: string; // e.g., "buttons", "cards", "forms"
  componentName: string;
  
  // Main documentation sections
  overview?: string; // General description
  whenToUse?: string; // Usage guidelines
  bestPractices?: string[]; // Array of best practice tips
  accessibility?: string; // A11y guidelines
  codeExamples?: CodeExample[];
  designNotes?: string; // Design decisions
  
  // Metadata
  author?: string;
  lastUpdated: string;
  tags?: string[];
  
  // Custom sections (user-defined)
  customSections?: {
    title: string;
    content: string;
  }[];
}

export interface CodeExample {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: 'tsx' | 'jsx' | 'html' | 'css' | 'javascript';
  framework?: 'react' | 'vue' | 'svelte' | 'angular' | 'vanilla';
}

export interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'markdown' | 'list' | 'code';
  }[];
}

// Pre-built documentation templates
export const DOCUMENTATION_TEMPLATES: DocumentationTemplate[] = [
  {
    id: 'component-standard',
    name: 'Component Standard',
    description: 'Standard documentation for UI components',
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        placeholder: 'Brief description of the component and its purpose...',
        type: 'markdown'
      },
      {
        key: 'whenToUse',
        label: 'When to Use',
        placeholder: 'Describe scenarios where this component should be used...',
        type: 'markdown'
      },
      {
        key: 'bestPractices',
        label: 'Best Practices',
        placeholder: 'Add best practice tips (one per line)',
        type: 'list'
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        placeholder: 'Document accessibility considerations, ARIA labels, keyboard navigation...',
        type: 'markdown'
      }
    ]
  },
  {
    id: 'design-system',
    name: 'Design System',
    description: 'Documentation for design system patterns',
    sections: [
      {
        key: 'overview',
        label: 'Pattern Overview',
        placeholder: 'Describe this design pattern...',
        type: 'markdown'
      },
      {
        key: 'designNotes',
        label: 'Design Decisions',
        placeholder: 'Document why certain design choices were made...',
        type: 'markdown'
      },
      {
        key: 'implementation',
        label: 'Implementation Guide',
        placeholder: 'How to implement this pattern...',
        type: 'markdown'
      }
    ]
  },
  {
    id: 'minimal',
    name: 'Quick Notes',
    description: 'Simple notes and comments',
    sections: [
      {
        key: 'notes',
        label: 'Notes',
        placeholder: 'Add your notes here...',
        type: 'markdown'
      }
    ]
  }
];
