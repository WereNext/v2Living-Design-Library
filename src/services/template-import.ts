/**
 * Template Import Service
 *
 * Orchestrates the complete template import flow:
 * 1. Fetch template from GitHub
 * 2. Extract design tokens
 * 3. Create design system
 * 4. Store template metadata
 */

import { githubService } from './github-service';
import { tokenExtractor, ExtractedTokens } from './token-extraction';
import { DesignSystem, Theme } from '../types';

export interface ImportProgress {
  step: 'fetching' | 'extracting' | 'creating' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
}

export interface ImportedTemplate {
  id: string;
  templateId: string;
  name: string;
  github: string;
  designSystemId: string;
  importedAt: number;
  tokens: ExtractedTokens;
  files: {
    tailwindConfig?: string;
    cssFiles: string[];
    themeFiles: string[];
  };
}

export class TemplateImportService {
  /**
   * Import a template repository and create a design system
   */
  async importTemplate(
    github: string,
    templateName: string,
    onProgress?: (progress: ImportProgress) => void
  ): Promise<{ designSystem: DesignSystem; template: ImportedTemplate }> {
    try {
      // Parse GitHub repo (owner/repo)
      const [owner, repo] = github.split('/');

      // Step 1: Fetch repository info
      onProgress?.({
        step: 'fetching',
        message: 'Fetching repository information...',
        progress: 10,
      });

      const repoInfo = await githubService.getRepo(owner, repo);

      // Step 2: Find config files
      onProgress?.({
        step: 'fetching',
        message: 'Locating configuration files...',
        progress: 30,
      });

      const configFiles = await githubService.findConfigFiles(owner, repo);

      // Step 3: Extract tokens
      onProgress?.({
        step: 'extracting',
        message: 'Extracting design tokens...',
        progress: 50,
      });

      const tokenSources: Partial<ExtractedTokens>[] = [];

      // Extract from Tailwind config
      if (configFiles.tailwindConfig) {
        try {
          const tailwindContent = await githubService.getFileContent(
            owner,
            repo,
            configFiles.tailwindConfig.path
          );
          const tailwindTokens = tokenExtractor.extractFromTailwind(tailwindContent);
          tokenSources.push(tailwindTokens);
        } catch (error) {
          console.error('Error extracting Tailwind tokens:', error);
        }
      }

      // Extract from CSS files
      if (configFiles.cssFiles && configFiles.cssFiles.length > 0) {
        for (const cssFile of configFiles.cssFiles.slice(0, 5)) {
          // Limit to first 5 CSS files
          try {
            const cssContent = await githubService.getFileContent(owner, repo, cssFile.path);

            // Check if it's a shadcn-style globals.css
            if (cssFile.name === 'globals.css' || cssFile.name === 'app.css') {
              const shadcnTokens = tokenExtractor.extractFromShadcnCSS(cssContent);
              tokenSources.push(shadcnTokens);
            } else {
              const cssTokens = tokenExtractor.extractFromCSS(cssContent);
              tokenSources.push(cssTokens);
            }
          } catch (error) {
            console.error(`Error extracting tokens from ${cssFile.path}:`, error);
          }
        }
      }

      // Merge all token sources
      const mergedTokens = tokenExtractor.mergeTokens(...tokenSources);

      // Step 4: Create design system
      onProgress?.({
        step: 'creating',
        message: 'Creating design system...',
        progress: 80,
      });

      const theme = tokenExtractor.tokensToTheme(mergedTokens, `${templateName} Theme`);

      const designSystem: DesignSystem = {
        id: `template-${Date.now()}`,
        name: templateName,
        description: `Imported from ${github}`,
        uiLibrary: this.detectUILibrary(configFiles.packageJson ? await githubService.getFileContent(owner, repo, configFiles.packageJson.path) : ''),
        themes: [theme],
        activeThemeId: theme.id,
        intents: [
          { value: 'web-app', label: 'Web App' },
        ],
      };

      // Create imported template record
      const importedTemplate: ImportedTemplate = {
        id: `import-${Date.now()}`,
        templateId: github,
        name: templateName,
        github,
        designSystemId: designSystem.id,
        importedAt: Date.now(),
        tokens: mergedTokens as ExtractedTokens,
        files: {
          tailwindConfig: configFiles.tailwindConfig?.path,
          cssFiles: configFiles.cssFiles?.map(f => f.path) || [],
          themeFiles: configFiles.themeFiles?.map(f => f.path) || [],
        },
      };

      // Step 5: Complete
      onProgress?.({
        step: 'complete',
        message: 'Import complete!',
        progress: 100,
      });

      return { designSystem, template: importedTemplate };
    } catch (error) {
      onProgress?.({
        step: 'error',
        message: error instanceof Error ? error.message : 'Import failed',
        progress: 0,
      });
      throw error;
    }
  }

  /**
   * Detect UI library from package.json
   */
  private detectUILibrary(packageJsonContent: string): 'shadcn' | 'mui' | 'chakra' | 'antd' | 'bootstrap' {
    try {
      const pkg = JSON.parse(packageJsonContent);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps['@radix-ui/react-dialog'] || deps['@shadcn/ui']) {
        return 'shadcn';
      }
      if (deps['@mui/material']) {
        return 'mui';
      }
      if (deps['@chakra-ui/react']) {
        return 'chakra';
      }
      if (deps['antd']) {
        return 'antd';
      }
      if (deps['bootstrap']) {
        return 'bootstrap';
      }

      // Default to shadcn for Tailwind-based projects
      return 'shadcn';
    } catch (error) {
      return 'shadcn';
    }
  }

  /**
   * Store imported template in localStorage
   */
  saveImportedTemplate(template: ImportedTemplate): void {
    const stored = this.getImportedTemplates();
    stored.push(template);
    localStorage.setItem('ldl-imported-templates', JSON.stringify(stored));
  }

  /**
   * Get all imported templates
   */
  getImportedTemplates(): ImportedTemplate[] {
    const stored = localStorage.getItem('ldl-imported-templates');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Get imported template by ID
   */
  getImportedTemplate(id: string): ImportedTemplate | undefined {
    return this.getImportedTemplates().find(t => t.id === id);
  }

  /**
   * Delete imported template
   */
  deleteImportedTemplate(id: string): void {
    const stored = this.getImportedTemplates();
    const filtered = stored.filter(t => t.id !== id);
    localStorage.setItem('ldl-imported-templates', JSON.stringify(filtered));
  }
}

export const templateImportService = new TemplateImportService();
