/**
 * Data Sync Module for Living Design Library MCP Server
 * Loads and syncs real app data from exported JSON file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, 'app-data.json');

/**
 * Load design systems from the exported app data file
 * @returns {Object} { designSystems: [], metadata: {} }
 */
export function loadAppData() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.error('⚠️  No app-data.json found. Export your design systems from the app first.');
      return {
        designSystems: [],
        metadata: {
          lastSync: null,
          source: 'none',
          message: 'No data synced yet. Use "Export for MCP" in the Living Design Library app.'
        }
      };
    }

    const fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);

    console.error(`✅ Loaded ${data.designSystems?.length || 0} design systems from app`);
    console.error(`   Last sync: ${data.metadata?.exportedAt || 'unknown'}`);
    
    return {
      designSystems: data.designSystems || [],
      metadata: {
        lastSync: data.metadata?.exportedAt,
        source: 'Living Design Library App',
        totalSystems: data.designSystems?.length || 0,
        ...data.metadata
      }
    };
  } catch (error) {
    console.error('❌ Error loading app data:', error.message);
    return {
      designSystems: [],
      metadata: {
        lastSync: null,
        source: 'error',
        error: error.message
      }
    };
  }
}

/**
 * Watch the data file for changes and call callback when it updates
 * @param {Function} callback - Called when file changes
 */
export function watchAppData(callback) {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error('⚠️  Data file not found, watching directory for creation...');
  }

  fs.watch(__dirname, (eventType, filename) => {
    if (filename === 'app-data.json' && eventType === 'change') {
      console.error('🔄 App data file changed, reloading...');
      callback();
    }
  });
}

/**
 * Get statistics about the loaded data
 * @param {Array} designSystems - Array of design systems
 * @returns {Object} Statistics object
 */
export function getDataStats(designSystems) {
  if (!designSystems || designSystems.length === 0) {
    return {
      totalSystems: 0,
      totalThemes: 0,
      totalComponents: 0,
      totalIntents: 0
    };
  }

  const stats = {
    totalSystems: designSystems.length,
    totalThemes: 0,
    totalComponents: 0,
    totalIntents: 0,
    systemNames: [],
    themeNames: [],
    intentCategories: new Set()
  };

  designSystems.forEach(system => {
    stats.systemNames.push(system.name);
    stats.totalThemes += system.themes?.length || 0;
    
    if (system.themes) {
      system.themes.forEach(theme => {
        stats.themeNames.push(`${system.name}/${theme.name}`);
      });
    }

    if (system.intents) {
      system.intents.forEach(intent => {
        if (typeof intent === 'string') {
          stats.intentCategories.add(intent);
        } else if (intent.category) {
          stats.intentCategories.add(intent.category);
        }
      });
    }
  });

  stats.totalIntents = stats.intentCategories.size;
  stats.intentCategories = Array.from(stats.intentCategories);

  return stats;
}

/**
 * Transform app design system format to MCP format
 * The app uses themes within design systems, MCP expects flat tokens
 * @param {Object} designSystem - Design system from app
 * @returns {Object} MCP-compatible design system
 */
export function transformToMCPFormat(designSystem) {
  if (!designSystem) return null;

  const activeTheme = designSystem.themes?.find(t => t.id === designSystem.activeThemeId) 
    || designSystem.themes?.[0];

  if (!activeTheme) {
    return {
      id: designSystem.id,
      name: designSystem.name,
      description: designSystem.description || '',
      tokens: {
        colors: {},
        spacing: {},
        typography: {},
        borderRadius: {},
        shadows: {}
      },
      intents: designSystem.intents || [],
      createdAt: designSystem.createdAt,
      source: 'Living Design Library App',
      themes: designSystem.themes || [],
      activeThemeId: designSystem.activeThemeId
    };
  }

  return {
    id: designSystem.id,
    name: designSystem.name,
    description: designSystem.description || '',
    tokens: {
      colors: activeTheme.colors || {},
      spacing: activeTheme.spacing || {},
      typography: activeTheme.typography || {},
      borderRadius: activeTheme.borderRadius || {},
      shadows: activeTheme.shadows || {},
      opacity: activeTheme.opacity || {},
      effects: activeTheme.effects || {}
    },
    intents: designSystem.intents || [],
    createdAt: designSystem.createdAt,
    source: 'Living Design Library App',
    activeThemeName: activeTheme.name,
    themes: designSystem.themes || [],
    activeThemeId: designSystem.activeThemeId,
    versions: designSystem.versions || [],
    currentVersionId: designSystem.currentVersionId
  };
}

/**
 * Get all available components from design systems
 * @param {Array} designSystems - Array of design systems
 * @returns {Array} Unique list of component names
 */
export function extractAvailableComponents(designSystems) {
  const components = new Set();

  designSystems.forEach(system => {
    if (system.intents) {
      system.intents.forEach(intent => {
        if (intent.components) {
          intent.components.forEach(comp => {
            if (typeof comp === 'string') {
              components.add(comp);
            } else if (comp.name) {
              components.add(comp.name);
            }
          });
        }
      });
    }
  });

  return Array.from(components);
}

/**
 * Get all available intents/categories from design systems
 * @param {Array} designSystems - Array of design systems
 * @returns {Array} Unique list of intent categories
 */
export function extractAvailableIntents(designSystems) {
  const intents = new Set();

  designSystems.forEach(system => {
    if (system.intents) {
      system.intents.forEach(intent => {
        if (typeof intent === 'string') {
          intents.add(intent);
        } else if (intent.category) {
          intents.add(intent.category);
        }
      });
    }
  });

  return Array.from(intents);
}

/**
 * Create export template for the app to use
 * @returns {Object} Template structure
 */
export function getExportTemplate() {
  return {
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedFrom: 'Living Design Library',
      version: '1.0.0',
      format: 'mcp-sync'
    },
    designSystems: [
      // Array of design systems from localStorage
      // Each should include: id, name, description, createdAt, themes[], activeThemeId, intents[], versions[]
    ]
  };
}
