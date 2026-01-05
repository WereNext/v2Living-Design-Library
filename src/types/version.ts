// Version types for design system versioning

export type VersionType = 'major' | 'minor' | 'patch';

export interface DesignSystemVersion {
  id: string;
  version: string; // semver format: "1.0.0"
  timestamp: string;
  notes: string;
  author?: string;
  changes: VersionChange[];
  
  // Complete snapshot of the system at this version
  snapshot: {
    name: string;
    description: string;
    themes: any[]; // Full theme data
    activeThemeId: string;
  };
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  category: 'colors' | 'typography' | 'spacing' | 'borderRadius' | 'shadows' | 'theme' | 'system';
  path: string; // e.g., "colors.primary", "themes.dark"
  oldValue?: any;
  newValue?: any;
  description?: string;
}

export interface VersionComparison {
  fromVersion: DesignSystemVersion;
  toVersion: DesignSystemVersion;
  changes: VersionChange[];
  summary: {
    added: number;
    modified: number;
    removed: number;
  };
}

export interface VersioningConfig {
  autoVersion: boolean; // Automatically create versions on save
  versionType: VersionType; // Default version increment type
  requireNotes: boolean; // Require release notes for versions
  maxVersions: number; // Maximum versions to keep (0 = unlimited)
}
