import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Theme } from "../hooks/useDesignSystems";

interface TokenChange {
  path: string; // e.g., "colors.primary"
  oldValue: string;
  newValue: string;
  timestamp: number;
}

// Type for nested token structure
type NestedTokenObject = {
  [key: string]: string | NestedTokenObject;
};

interface TokenEditorContextType {
  editedTokens: Map<string, string>;
  changes: TokenChange[];
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  updateToken: (path: string, oldValue: string, newValue: string) => void;
  resetToken: (path: string) => void;
  resetAllTokens: () => void;
  getTokenValue: (path: string, originalTheme: Theme) => string;
  hasChanges: boolean;
  exportChanges: () => NestedTokenObject;
  applyThemeOverrides: (theme: Theme) => Theme;
}

const TokenEditorContext = createContext<TokenEditorContextType | undefined>(undefined);

export function TokenEditorProvider({ children }: { children: ReactNode }) {
  const [editedTokens, setEditedTokens] = useState<Map<string, string>>(new Map());
  const [changes, setChanges] = useState<TokenChange[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const updateToken = useCallback((path: string, oldValue: string, newValue: string) => {
    setEditedTokens(prev => {
      const newMap = new Map(prev);
      newMap.set(path, newValue);
      return newMap;
    });

    setChanges(prev => [
      ...prev,
      { path, oldValue, newValue, timestamp: Date.now() }
    ]);
  }, []);

  const resetToken = useCallback((path: string) => {
    setEditedTokens(prev => {
      const newMap = new Map(prev);
      newMap.delete(path);
      return newMap;
    });
  }, []);

  const resetAllTokens = useCallback(() => {
    setEditedTokens(new Map());
    setChanges([]);
  }, []);

  const getTokenValue = useCallback((path: string, originalTheme: Theme): string => {
    if (editedTokens.has(path)) {
      return editedTokens.get(path) ?? '';
    }

    // Parse path like "colors.primary"
    const parts = path.split('.');
    let value: unknown = originalTheme;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        value = undefined;
      }
    }
    return typeof value === 'string' ? value : '';
  }, [editedTokens]);

  const exportChanges = useCallback((): NestedTokenObject => {
    const result: NestedTokenObject = {};

    editedTokens.forEach((value, path) => {
      const parts = path.split('.');
      let current: NestedTokenObject = result;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]] || typeof current[parts[i]] === 'string') {
          current[parts[i]] = {};
        }
        current = current[parts[i]] as NestedTokenObject;
      }

      current[parts[parts.length - 1]] = value;
    });

    return result;
  }, [editedTokens]);

  const applyThemeOverrides = useCallback((theme: Theme): Theme => {
    if (editedTokens.size === 0) return theme;

    const overriddenTheme: Theme = JSON.parse(JSON.stringify(theme));

    editedTokens.forEach((value, path) => {
      const parts = path.split('.');
      let current: Record<string, unknown> = overriddenTheme as unknown as Record<string, unknown>;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
          current[parts[i]] = {};
        }
        current = current[parts[i]] as Record<string, unknown>;
      }

      current[parts[parts.length - 1]] = value;
    });

    return overriddenTheme;
  }, [editedTokens]);

  const hasChanges = editedTokens.size > 0;

  return (
    <TokenEditorContext.Provider
      value={{
        editedTokens,
        changes,
        isEditing,
        setIsEditing,
        updateToken,
        resetToken,
        resetAllTokens,
        getTokenValue,
        hasChanges,
        exportChanges,
        applyThemeOverrides,
      }}
    >
      {children}
    </TokenEditorContext.Provider>
  );
}

export function useTokenEditor() {
  const context = useContext(TokenEditorContext);
  if (!context) {
    throw new Error("useTokenEditor must be used within TokenEditorProvider");
  }
  return context;
}
