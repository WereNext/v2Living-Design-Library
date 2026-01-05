/**
 * Service Layer Types
 *
 * Defines interfaces for the storage abstraction layer that supports
 * both localStorage and Supabase backends.
 */

// =============================================================================
// Result Types
// =============================================================================

/**
 * Standard result type for service operations
 */
export interface ServiceResult<T> {
  /** The data returned by the operation, or null on error */
  data: T | null;
  /** Error object if the operation failed */
  error: Error | null;
  /** Whether the data came from local cache */
  isFromCache?: boolean;
}

/**
 * Paginated result for list operations
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =============================================================================
// Service Interfaces
// =============================================================================

/**
 * Base storage service interface
 * All entity services should implement this interface
 */
export interface IStorageService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /** Get all records */
  getAll(): Promise<ServiceResult<T[]>>;

  /** Get a single record by ID */
  getById(id: string): Promise<ServiceResult<T>>;

  /** Create a new record */
  create(data: TCreate): Promise<ServiceResult<T>>;

  /** Update an existing record */
  update(id: string, data: TUpdate): Promise<ServiceResult<T>>;

  /** Delete a record */
  delete(id: string): Promise<ServiceResult<boolean>>;
}

/**
 * Extended interface for services that support sharing
 */
export interface ISharableService<T> extends IStorageService<T> {
  /** Publish a record with a shareable slug */
  publish(id: string, slug: string): Promise<ServiceResult<T>>;

  /** Unpublish a record */
  unpublish(id: string): Promise<ServiceResult<T>>;

  /** Get a record by its public slug */
  getBySlug(slug: string): Promise<ServiceResult<T>>;

  /** Check if a slug is available */
  isSlugAvailable(slug: string): Promise<boolean>;
}

// =============================================================================
// Design System Types (for services)
// =============================================================================

import type { Theme, DesignSystem } from '../hooks/useDesignSystems';
import type { ComponentDocumentation } from '../types/documentation';
import type { LDLTokenDocument } from '../lib/ldl/types';

/**
 * Design System create input
 */
export interface DesignSystemCreate {
  name: string;
  description?: string;
  useIcons?: boolean;
  themes?: Omit<Theme, 'id'>[];
  intents?: Array<{
    id: string;
    value: string;
    label: string;
    description?: string;
    icon?: string;
    categories?: Array<{ id: string; name: string; icon: string }>;
  }>;
}

/**
 * Design System update input
 */
export interface DesignSystemUpdate {
  name?: string;
  description?: string;
  useIcons?: boolean;
  activeThemeId?: string;
  currentVersionId?: string;
  isPublic?: boolean;
  shareSlug?: string;
}

/**
 * Theme create input
 */
export interface ThemeCreate {
  name: string;
  description?: string;
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  typography?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  sidebar?: Record<string, string>;
  opacity?: Record<string, string>;
  effects?: Record<string, string>;
  colorTheme?: string;
  fontFamily?: string;
  visualFeel?: string;
  componentStyles?: Record<string, unknown>;
}

/**
 * Documentation create input
 */
export interface DocumentationCreate {
  componentId: string;
  componentName: string;
  designSystemId?: string;
  overview?: string;
  whenToUse?: string;
  bestPractices?: string[];
  accessibility?: string;
  designNotes?: string;
  codeExamples?: Array<{
    id: string;
    title: string;
    description?: string;
    code: string;
    language: string;
    framework?: string;
  }>;
  customSections?: Array<{ title: string; content: string }>;
  author?: string;
  tags?: string[];
}

/**
 * LDL Document create input
 */
export interface LDLDocumentCreate {
  name: string;
  description?: string;
  version?: string;
  designSystemId?: string;
  color?: Record<string, unknown>;
  space?: Record<string, string>;
  radius?: Record<string, string>;
  shadow?: Record<string, string>;
  font?: Record<string, unknown>;
  duration?: Record<string, string>;
  ease?: Record<string, string>;
  component?: Record<string, unknown>;
  mode?: Record<string, unknown>;
}

/**
 * LDL Document with metadata
 */
export interface LDLDocumentWithMeta extends LDLTokenDocument {
  id: string;
  userId?: string;
  designSystemId?: string;
  isPublic: boolean;
  shareSlug?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Service Method Types
// =============================================================================

/**
 * Design Systems service interface
 */
export interface IDesignSystemsService
  extends IStorageService<DesignSystem, DesignSystemCreate, DesignSystemUpdate>,
    ISharableService<DesignSystem> {
  /** Add a theme to a design system */
  addTheme(systemId: string, theme: ThemeCreate): Promise<ServiceResult<Theme>>;

  /** Update a theme */
  updateTheme(
    systemId: string,
    themeId: string,
    updates: Partial<Theme>
  ): Promise<ServiceResult<Theme>>;

  /** Delete a theme */
  deleteTheme(systemId: string, themeId: string): Promise<ServiceResult<boolean>>;

  /** Set the active theme for a system */
  setActiveTheme(systemId: string, themeId: string): Promise<ServiceResult<boolean>>;
}

/**
 * Documentation service interface
 */
export interface IDocumentationService
  extends IStorageService<ComponentDocumentation, DocumentationCreate, Partial<ComponentDocumentation>> {
  /** Get documentation by component ID */
  getByComponentId(componentId: string): Promise<ServiceResult<ComponentDocumentation>>;

  /** Get all documentation for a design system */
  getByDesignSystem(systemId: string): Promise<ServiceResult<ComponentDocumentation[]>>;
}

/**
 * LDL Documents service interface
 */
export interface ILDLDocumentsService
  extends IStorageService<LDLDocumentWithMeta, LDLDocumentCreate, Partial<LDLDocumentCreate>>,
    ISharableService<LDLDocumentWithMeta> {
  /** Get all documents for a design system */
  getByDesignSystem(systemId: string): Promise<ServiceResult<LDLDocumentWithMeta[]>>;

  /** Get all public documents */
  getPublic(): Promise<ServiceResult<LDLDocumentWithMeta[]>>;
}

// =============================================================================
// Intent Types
// =============================================================================

/**
 * Category within an intent
 */
export interface IntentCategory {
  id: string;
  name: string;
  icon: string;
}

/**
 * Design Intent entity
 */
export interface DesignIntent {
  id: string;
  label: string;
  description?: string;
  categories: IntentCategory[];
  tokens?: unknown;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Intent create input
 */
export interface IntentCreate {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  categories: IntentCategory[];
  tokens?: unknown;
  designSystemId?: string;
}

/**
 * Intent service interface
 */
export interface IIntentService
  extends IStorageService<DesignIntent, IntentCreate, Partial<IntentCreate>> {
  /** Get all custom intents for a user */
  getCustomIntents(): Promise<ServiceResult<DesignIntent[]>>;

  /** Get intents for a specific design system */
  getByDesignSystem(systemId: string): Promise<ServiceResult<DesignIntent[]>>;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a success result
 */
export function success<T>(data: T, isFromCache = false): ServiceResult<T> {
  return { data, error: null, isFromCache };
}

/**
 * Create an error result
 */
export function failure<T>(error: Error | string): ServiceResult<T> {
  return {
    data: null,
    error: typeof error === 'string' ? new Error(error) : error,
  };
}

/**
 * Wrap an async operation with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  isFromCache = false
): Promise<ServiceResult<T>> {
  try {
    const data = await operation();
    return success(data, isFromCache);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
}
