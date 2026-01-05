// Re-export from refactored module
// Original: 781 LOC -> Now split into:
// - design-system-builder/DesignSystemBuilder.tsx (~350 LOC) - main component
// - design-system-builder/VariableList.tsx - variable editor component
// - design-system-builder/IntentManager.tsx - intent management
// - design-system-builder/useVariables.ts - variable state hook
// - design-system-builder/types.ts - type definitions
export { DesignSystemBuilder } from './design-system-builder';
