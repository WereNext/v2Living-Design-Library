/**
 * Services Index
 *
 * Export all service types, implementations, and the factory.
 */

// Types
export * from './types';

// Factory
export { serviceFactory, useServices, useLocalServices } from './ServiceFactory';
export type { StorageMode } from './ServiceFactory';

// Local Services
export {
  LocalDesignSystemsService,
  LocalLDLService,
  LocalDocumentationService,
  LocalIntentService,
} from './local';

// Supabase Services
export {
  SupabaseDesignSystemsService,
  SupabaseLDLService,
  SupabaseDocumentationService,
  SupabaseIntentService,
} from './supabase';
