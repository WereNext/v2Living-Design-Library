// Re-export from refactored module
// Original: 1,095 LOC -> Now split into:
// - playground/PlaygroundShowcase.tsx (~230 LOC) - main component
// - playground/components/*.tsx - component definitions by category
// - lib/syntax-theme.ts - syntax highlighting theme
export { PlaygroundShowcase } from "./playground";
export type { PlaygroundComponent, PlaygroundIntent, PlaygroundCategory } from "./playground";
