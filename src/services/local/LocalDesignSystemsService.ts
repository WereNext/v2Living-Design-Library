/**
 * Local Storage Design Systems Service
 *
 * Implements the design systems service using localStorage.
 * This wraps the existing localStorage logic into the service interface.
 */

import {
  IDesignSystemsService,
  ServiceResult,
  DesignSystemCreate,
  DesignSystemUpdate,
  ThemeCreate,
  success,
  failure,
  withErrorHandling,
} from '../types';
import { DesignSystem, Theme } from '../../hooks/useDesignSystems';
import { STORAGE_KEYS } from '../../lib/constants';

export class LocalDesignSystemsService implements IDesignSystemsService {
  private readonly storageKey = STORAGE_KEYS.DESIGN_SYSTEMS;

  // ==========================================================================
  // Read Operations
  // ==========================================================================

  async getAll(): Promise<ServiceResult<DesignSystem[]>> {
    return withErrorHandling(async () => {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }, true);
  }

  async getById(id: string): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      const system = result.data?.find((s) => s.id === id);
      if (!system) throw new Error(`Design system not found: ${id}`);

      return system;
    }, true);
  }

  // ==========================================================================
  // Write Operations
  // ==========================================================================

  async create(data: DesignSystemCreate): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = result.data || [];

      const newSystem: DesignSystem = {
        id: `system-${Date.now()}`,
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
        useIcons: data.useIcons ?? true,
        themes: (data.themes || []).map((t, i) => ({
          ...t,
          // Preserve existing ID if provided, otherwise generate new one
          id: t.id || `theme-${Date.now()}-${i}`,
          colors: t.colors || {},
          spacing: t.spacing || {},
          typography: t.typography || {},
          borderRadius: t.borderRadius || {},
          shadows: t.shadows || {},
        })),
        activeThemeId: data.activeThemeId,
        intents: data.intents,
        versions: [],
      };

      // Set first theme as active if not specified
      if (!newSystem.activeThemeId && newSystem.themes.length > 0) {
        newSystem.activeThemeId = newSystem.themes[0].id;
      }

      systems.push(newSystem);
      localStorage.setItem(this.storageKey, JSON.stringify(systems));

      return newSystem;
    }, true);
  }

  async update(
    id: string,
    data: DesignSystemUpdate
  ): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = result.data || [];

      const index = systems.findIndex((s) => s.id === id);
      if (index === -1) throw new Error(`Design system not found: ${id}`);

      systems[index] = {
        ...systems[index],
        ...data,
        // Don't allow overwriting these
        id: systems[index].id,
        createdAt: systems[index].createdAt,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(systems));
      return systems[index];
    }, true);
  }

  async delete(id: string): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = (result.data || []).filter((s) => s.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(systems));
      return true;
    }, true);
  }

  // ==========================================================================
  // Theme Operations
  // ==========================================================================

  async addTheme(
    systemId: string,
    theme: ThemeCreate
  ): Promise<ServiceResult<Theme>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = result.data || [];

      const index = systems.findIndex((s) => s.id === systemId);
      if (index === -1) throw new Error(`Design system not found: ${systemId}`);

      const newTheme: Theme = {
        id: `theme-${Date.now()}`,
        name: theme.name,
        description: theme.description,
        colors: theme.colors || {},
        spacing: theme.spacing || {},
        typography: theme.typography || {},
        borderRadius: theme.borderRadius || {},
        shadows: theme.shadows || {},
        sidebar: theme.sidebar,
        opacity: theme.opacity,
        effects: theme.effects,
        colorTheme: theme.colorTheme as Theme['colorTheme'],
        fontFamily: theme.fontFamily as Theme['fontFamily'],
        visualFeel: theme.visualFeel as Theme['visualFeel'],
        componentStyles: theme.componentStyles as Theme['componentStyles'],
      };

      systems[index].themes.push(newTheme);
      localStorage.setItem(this.storageKey, JSON.stringify(systems));

      return newTheme;
    }, true);
  }

  async updateTheme(
    systemId: string,
    themeId: string,
    updates: Partial<Theme>
  ): Promise<ServiceResult<Theme>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = result.data || [];

      const systemIndex = systems.findIndex((s) => s.id === systemId);
      if (systemIndex === -1)
        throw new Error(`Design system not found: ${systemId}`);

      const themeIndex = systems[systemIndex].themes.findIndex(
        (t) => t.id === themeId
      );
      if (themeIndex === -1) throw new Error(`Theme not found: ${themeId}`);

      systems[systemIndex].themes[themeIndex] = {
        ...systems[systemIndex].themes[themeIndex],
        ...updates,
        id: themeId, // Don't allow changing ID
      };

      localStorage.setItem(this.storageKey, JSON.stringify(systems));
      return systems[systemIndex].themes[themeIndex];
    }, true);
  }

  async deleteTheme(
    systemId: string,
    themeId: string
  ): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = result.data || [];

      const index = systems.findIndex((s) => s.id === systemId);
      if (index === -1) throw new Error(`Design system not found: ${systemId}`);

      systems[index].themes = systems[index].themes.filter(
        (t) => t.id !== themeId
      );

      // Update active theme if deleted
      if (systems[index].activeThemeId === themeId) {
        systems[index].activeThemeId = systems[index].themes[0]?.id;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(systems));
      return true;
    }, true);
  }

  async setActiveTheme(
    systemId: string,
    themeId: string
  ): Promise<ServiceResult<boolean>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      const systems = result.data || [];

      const index = systems.findIndex((s) => s.id === systemId);
      if (index === -1) throw new Error(`Design system not found: ${systemId}`);

      const themeExists = systems[index].themes.some((t) => t.id === themeId);
      if (!themeExists) throw new Error(`Theme not found: ${themeId}`);

      systems[index].activeThemeId = themeId;
      localStorage.setItem(this.storageKey, JSON.stringify(systems));

      return true;
    }, true);
  }

  // ==========================================================================
  // Sharing Operations (not fully supported in local mode)
  // ==========================================================================

  async publish(id: string, slug: string): Promise<ServiceResult<DesignSystem>> {
    // Local storage doesn't support true publishing
    // Just update the system with the slug for later sync
    return this.update(id, { isPublic: true, shareSlug: slug });
  }

  async unpublish(id: string): Promise<ServiceResult<DesignSystem>> {
    return this.update(id, { isPublic: false, shareSlug: undefined });
  }

  async getBySlug(slug: string): Promise<ServiceResult<DesignSystem>> {
    return withErrorHandling(async () => {
      const result = await this.getAll();
      if (result.error) throw result.error;

      const system = result.data?.find(
        (s) => (s as DesignSystem & { shareSlug?: string }).shareSlug === slug
      );
      if (!system) throw new Error(`Design system not found with slug: ${slug}`);

      return system;
    }, true);
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    const result = await this.getBySlug(slug);
    return result.error !== null; // Available if not found (error)
  }
}
