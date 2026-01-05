// Version types for design system versioning

export type VersionType = 'major' | 'minor' | 'patch';

// Theme snapshot type for versioning
export interface ThemeSnapshot {
  id: string;
  name: string;
  description?: string;
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  typography?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  [key: string]: string | Record<string, string> | undefined;
}

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
    themes: ThemeSnapshot[];
    activeThemeId: string;
  };
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  category: 'colors' | 'typography' | 'spacing' | 'borderRadius' | 'shadows' | 'theme' | 'system';
  path: string; // e.g., "colors.primary", "themes.dark"
  oldValue?: string;
  newValue?: string;
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
