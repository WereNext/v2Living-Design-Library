import { describe, it, expect } from 'vitest';
import {
  parseVersion,
  incrementVersion,
  compareVersions,
  getLatestVersion,
  detectChanges,
  createVersionSnapshot,
  compareVersionSnapshots,
} from '../lib/version-utilities';
import { DesignSystemVersion } from '../types/version';

describe('Version Utilities', () => {
  describe('parseVersion', () => {
    it('should parse valid semantic version', () => {
      expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
    });

    it('should handle missing minor and patch', () => {
      expect(parseVersion('1')).toEqual({ major: 1, minor: 0, patch: 0 });
      expect(parseVersion('1.2')).toEqual({ major: 1, minor: 2, patch: 0 });
    });

    it('should handle invalid versions', () => {
      expect(parseVersion('')).toEqual({ major: 0, minor: 0, patch: 0 });
      expect(parseVersion('abc')).toEqual({ major: 0, minor: 0, patch: 0 });
    });
  });

  describe('incrementVersion', () => {
    it('should increment major version', () => {
      expect(incrementVersion('1.2.3', 'major')).toBe('2.0.0');
      expect(incrementVersion('0.5.10', 'major')).toBe('1.0.0');
    });

    it('should increment minor version', () => {
      expect(incrementVersion('1.2.3', 'minor')).toBe('1.3.0');
      expect(incrementVersion('2.0.0', 'minor')).toBe('2.1.0');
    });

    it('should increment patch version', () => {
      expect(incrementVersion('1.2.3', 'patch')).toBe('1.2.4');
      expect(incrementVersion('1.0.0', 'patch')).toBe('1.0.1');
    });

    it('should handle edge cases', () => {
      expect(incrementVersion('0.0.0', 'major')).toBe('1.0.0');
      expect(incrementVersion('99.99.99', 'patch')).toBe('99.99.100');
    });
  });

  describe('compareVersions', () => {
    it('should compare major versions correctly', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBeGreaterThan(0);
      expect(compareVersions('1.0.0', '2.0.0')).toBeLessThan(0);
    });

    it('should compare minor versions correctly', () => {
      expect(compareVersions('1.2.0', '1.1.0')).toBeGreaterThan(0);
      expect(compareVersions('1.1.0', '1.2.0')).toBeLessThan(0);
    });

    it('should compare patch versions correctly', () => {
      expect(compareVersions('1.0.2', '1.0.1')).toBeGreaterThan(0);
      expect(compareVersions('1.0.1', '1.0.2')).toBeLessThan(0);
    });

    it('should return 0 for equal versions', () => {
      expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
      expect(compareVersions('0.0.0', '0.0.0')).toBe(0);
    });

    it('should prioritize major over minor and patch', () => {
      expect(compareVersions('2.0.0', '1.9.9')).toBeGreaterThan(0);
      expect(compareVersions('1.9.9', '2.0.0')).toBeLessThan(0);
    });
  });

  describe('getLatestVersion', () => {
    const createVersion = (version: string): DesignSystemVersion => ({
      id: `v${version}`,
      version,
      timestamp: new Date().toISOString(),
      notes: '',
      changes: [],
      snapshot: { themes: [] },
    });

    it('should return latest version from array', () => {
      const versions = [
        createVersion('1.0.0'),
        createVersion('1.2.0'),
        createVersion('1.1.0'),
      ];
      const latest = getLatestVersion(versions);
      expect(latest?.version).toBe('1.2.0');
    });

    it('should handle empty array', () => {
      expect(getLatestVersion([])).toBeNull();
    });

    it('should handle single version', () => {
      const versions = [createVersion('1.0.0')];
      expect(getLatestVersion(versions)?.version).toBe('1.0.0');
    });

    it('should handle complex version numbers', () => {
      const versions = [
        createVersion('1.0.0'),
        createVersion('2.0.0'),
        createVersion('1.5.10'),
        createVersion('1.5.2'),
      ];
      expect(getLatestVersion(versions)?.version).toBe('2.0.0');
    });
  });

  describe('detectChanges', () => {
    it('should detect added themes', () => {
      const oldSnapshot = { themes: [] };
      const newSnapshot = {
        themes: [{ id: 'theme-1', name: 'Light', colors: {} }],
      };
      const changes = detectChanges(oldSnapshot, newSnapshot);

      const addedChanges = changes.filter(c => c.type === 'added');
      expect(addedChanges.length).toBeGreaterThan(0);
    });

    it('should detect removed themes', () => {
      const oldSnapshot = {
        themes: [{ id: 'theme-1', name: 'Light', colors: {} }],
      };
      const newSnapshot = { themes: [] };
      const changes = detectChanges(oldSnapshot, newSnapshot);

      const removedChanges = changes.filter(c => c.type === 'removed');
      expect(removedChanges.length).toBeGreaterThan(0);
    });

    it('should detect modified tokens', () => {
      const oldSnapshot = {
        themes: [{ id: 'theme-1', name: 'Light', colors: { primary: '#000' } }],
      };
      const newSnapshot = {
        themes: [{ id: 'theme-1', name: 'Light', colors: { primary: '#fff' } }],
      };
      const changes = detectChanges(oldSnapshot, newSnapshot);

      const modifiedChanges = changes.filter(c => c.type === 'modified');
      expect(modifiedChanges.length).toBeGreaterThan(0);
    });

    it('should detect system name changes', () => {
      const oldSnapshot = { name: 'Old Name', themes: [] };
      const newSnapshot = { name: 'New Name', themes: [] };
      const changes = detectChanges(oldSnapshot, newSnapshot);

      expect(changes.some(c => c.path === 'name')).toBe(true);
    });
  });

  describe('createVersionSnapshot', () => {
    it('should create initial version snapshot', () => {
      const system = {
        name: 'Test System',
        description: 'A test',
        themes: [{ id: 'theme-1', name: 'Light' }],
      };

      const snapshot = createVersionSnapshot(system, 'major', 'Initial release');

      expect(snapshot.version).toBe('1.0.0');
      expect(snapshot.notes).toBe('Initial release');
      expect(snapshot.snapshot.name).toBe('Test System');
    });

    it('should increment from previous version', () => {
      const system = { name: 'Test', themes: [] };
      const previousVersion: DesignSystemVersion = {
        id: 'v1',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        notes: '',
        changes: [],
        snapshot: { themes: [] },
      };

      const snapshot = createVersionSnapshot(system, 'minor', 'Update', previousVersion);

      expect(snapshot.version).toBe('1.1.0');
    });
  });

  describe('compareVersionSnapshots', () => {
    it('should compare two version snapshots', () => {
      const v1: DesignSystemVersion = {
        id: 'v1',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        notes: '',
        changes: [],
        snapshot: {
          themes: [{ id: 'theme-1', colors: { primary: '#000' } }],
        },
      };

      const v2: DesignSystemVersion = {
        id: 'v2',
        version: '1.1.0',
        timestamp: new Date().toISOString(),
        notes: '',
        changes: [],
        snapshot: {
          themes: [{ id: 'theme-1', colors: { primary: '#fff', secondary: '#ccc' } }],
        },
      };

      const comparison = compareVersionSnapshots(v1, v2);

      expect(comparison.summary.modified).toBeGreaterThan(0);
      expect(comparison.summary.added).toBeGreaterThan(0);
    });
  });
});