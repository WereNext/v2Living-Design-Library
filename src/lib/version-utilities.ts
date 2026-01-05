// Utility functions for design system versioning

import { DesignSystemVersion, VersionChange, VersionType, VersionComparison } from '../types/version';

/**
 * Parse semantic version string
 */
export function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const parts = version.split('.').map(n => parseInt(n, 10));
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

/**
 * Increment version based on type
 */
export function incrementVersion(currentVersion: string, type: VersionType): string {
  const { major, minor, patch } = parseVersion(currentVersion);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

/**
 * Compare two versions (returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2)
 */
export function compareVersions(v1: string, v2: string): number {
  const ver1 = parseVersion(v1);
  const ver2 = parseVersion(v2);
  
  if (ver1.major !== ver2.major) return ver1.major - ver2.major;
  if (ver1.minor !== ver2.minor) return ver1.minor - ver2.minor;
  return ver1.patch - ver2.patch;
}

/**
 * Get latest version from array
 */
export function getLatestVersion(versions: DesignSystemVersion[]): DesignSystemVersion | null {
  if (versions.length === 0) return null;
  
  return versions.reduce((latest, current) => {
    return compareVersions(current.version, latest.version) > 0 ? current : latest;
  });
}

/**
 * Create version snapshot from design system
 */
export function createVersionSnapshot(
  system: any,
  versionType: VersionType,
  notes: string,
  previousVersion?: DesignSystemVersion,
  author?: string
): DesignSystemVersion {
  const previousVersionNumber = previousVersion?.version || '0.0.0';
  const newVersionNumber = incrementVersion(previousVersionNumber, versionType);
  
  // Detect changes
  const changes = previousVersion 
    ? detectChanges(previousVersion.snapshot, system)
    : [{ type: 'added' as const, category: 'system' as const, path: 'system', description: 'Initial version', newValue: system.name }];
  
  return {
    id: `v${newVersionNumber}-${Date.now()}`,
    version: newVersionNumber,
    timestamp: new Date().toISOString(),
    notes,
    author,
    changes,
    snapshot: {
      name: system.name,
      description: system.description,
      themes: JSON.parse(JSON.stringify(system.themes)), // Deep clone
      activeThemeId: system.activeThemeId,
    },
  };
}

/**
 * Detect changes between two system snapshots
 */
export function detectChanges(oldSnapshot: any, newSnapshot: any): VersionChange[] {
  const changes: VersionChange[] = [];
  
  // Compare themes
  const oldThemes = oldSnapshot.themes || [];
  const newThemes = newSnapshot.themes || [];
  
  // Find added themes
  newThemes.forEach((newTheme: any) => {
    const oldTheme = oldThemes.find((t: any) => t.id === newTheme.id);
    if (!oldTheme) {
      changes.push({
        type: 'added',
        category: 'theme',
        path: `themes.${newTheme.id}`,
        newValue: newTheme.name,
        description: `Added theme "${newTheme.name}"`,
      });
    } else {
      // Compare theme tokens
      const themeChanges = compareThemeTokens(oldTheme, newTheme);
      changes.push(...themeChanges);
    }
  });
  
  // Find removed themes
  oldThemes.forEach((oldTheme: any) => {
    const newTheme = newThemes.find((t: any) => t.id === oldTheme.id);
    if (!newTheme) {
      changes.push({
        type: 'removed',
        category: 'theme',
        path: `themes.${oldTheme.id}`,
        oldValue: oldTheme.name,
        description: `Removed theme "${oldTheme.name}"`,
      });
    }
  });
  
  // Compare system-level properties
  if (oldSnapshot.name !== newSnapshot.name) {
    changes.push({
      type: 'modified',
      category: 'system',
      path: 'name',
      oldValue: oldSnapshot.name,
      newValue: newSnapshot.name,
      description: `Renamed system from "${oldSnapshot.name}" to "${newSnapshot.name}"`,
    });
  }
  
  if (oldSnapshot.description !== newSnapshot.description) {
    changes.push({
      type: 'modified',
      category: 'system',
      path: 'description',
      oldValue: oldSnapshot.description,
      newValue: newSnapshot.description,
      description: 'Updated system description',
    });
  }
  
  return changes;
}

/**
 * Compare tokens between two theme snapshots
 */
function compareThemeTokens(oldTheme: any, newTheme: any): VersionChange[] {
  const changes: VersionChange[] = [];
  const categories = ['colors', 'spacing', 'typography', 'borderRadius', 'shadows'];
  
  categories.forEach(category => {
    const oldTokens = oldTheme[category] || {};
    const newTokens = newTheme[category] || {};
    
    // Find added and modified tokens
    Object.keys(newTokens).forEach(key => {
      const oldValue = oldTokens[key];
      const newValue = newTokens[key];
      
      if (oldValue === undefined) {
        changes.push({
          type: 'added',
          category: category as any,
          path: `themes.${newTheme.id}.${category}.${key}`,
          newValue,
          description: `Added ${category} token "${key}"`,
        });
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          type: 'modified',
          category: category as any,
          path: `themes.${newTheme.id}.${category}.${key}`,
          oldValue,
          newValue,
          description: `Modified ${category} token "${key}"`,
        });
      }
    });
    
    // Find removed tokens
    Object.keys(oldTokens).forEach(key => {
      if (newTokens[key] === undefined) {
        changes.push({
          type: 'removed',
          category: category as any,
          path: `themes.${newTheme.id}.${category}.${key}`,
          oldValue: oldTokens[key],
          description: `Removed ${category} token "${key}"`,
        });
      }
    });
  });
  
  return changes;
}

/**
 * Compare two versions and generate detailed comparison
 */
export function compareVersionSnapshots(
  fromVersion: DesignSystemVersion,
  toVersion: DesignSystemVersion
): VersionComparison {
  const changes = detectChanges(fromVersion.snapshot, toVersion.snapshot);
  
  const summary = {
    added: changes.filter(c => c.type === 'added').length,
    modified: changes.filter(c => c.type === 'modified').length,
    removed: changes.filter(c => c.type === 'removed').length,
  };
  
  return {
    fromVersion,
    toVersion,
    changes,
    summary,
  };
}

/**
 * Generate changelog text from version
 */
export function generateChangelog(version: DesignSystemVersion): string {
  let changelog = `# Version ${version.version}\n\n`;
  changelog += `**Released:** ${new Date(version.timestamp).toLocaleDateString()}\n\n`;
  
  if (version.author) {
    changelog += `**Author:** ${version.author}\n\n`;
  }
  
  if (version.notes) {
    changelog += `## Release Notes\n\n${version.notes}\n\n`;
  }
  
  if (version.changes.length > 0) {
    changelog += `## Changes\n\n`;
    
    const added = version.changes.filter(c => c.type === 'added');
    const modified = version.changes.filter(c => c.type === 'modified');
    const removed = version.changes.filter(c => c.type === 'removed');
    
    if (added.length > 0) {
      changelog += `### ✨ Added (${added.length})\n\n`;
      added.forEach(change => {
        changelog += `- ${change.description || change.path}\n`;
      });
      changelog += '\n';
    }
    
    if (modified.length > 0) {
      changelog += `### 🔧 Modified (${modified.length})\n\n`;
      modified.forEach(change => {
        changelog += `- ${change.description || change.path}\n`;
      });
      changelog += '\n';
    }
    
    if (removed.length > 0) {
      changelog += `### 🗑️ Removed (${removed.length})\n\n`;
      removed.forEach(change => {
        changelog += `- ${change.description || change.path}\n`;
      });
      changelog += '\n';
    }
  }
  
  return changelog;
}

/**
 * Prune old versions keeping only the specified number
 */
export function pruneVersions(versions: DesignSystemVersion[], maxVersions: number): DesignSystemVersion[] {
  if (maxVersions === 0 || versions.length <= maxVersions) {
    return versions;
  }
  
  // Sort by version number (descending) and keep the newest ones
  const sorted = [...versions].sort((a, b) => compareVersions(b.version, a.version));
  return sorted.slice(0, maxVersions);
}

/**
 * Export version as JSON
 */
export function exportVersion(version: DesignSystemVersion): string {
  return JSON.stringify(version, null, 2);
}

/**
 * Import version from JSON
 */
export function importVersion(json: string): DesignSystemVersion | null {
  try {
    const version = JSON.parse(json);
    
    // Validate required fields
    if (!version.id || !version.version || !version.timestamp || !version.snapshot) {
      return null;
    }
    
    return version as DesignSystemVersion;
  } catch (error) {
    return null;
  }
}
