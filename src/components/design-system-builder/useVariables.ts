import { useState, useCallback } from 'react';
import type { Variable, VariableType } from './types';

interface UseVariablesReturn {
  colors: Variable[];
  spacing: Variable[];
  typography: Variable[];
  borderRadius: Variable[];
  shadows: Variable[];
  setColors: React.Dispatch<React.SetStateAction<Variable[]>>;
  setSpacing: React.Dispatch<React.SetStateAction<Variable[]>>;
  setTypography: React.Dispatch<React.SetStateAction<Variable[]>>;
  setBorderRadius: React.Dispatch<React.SetStateAction<Variable[]>>;
  setShadows: React.Dispatch<React.SetStateAction<Variable[]>>;
  addVariable: (type: VariableType) => void;
  removeVariable: (type: VariableType, id: string) => void;
  updateVariable: (type: VariableType, id: string, field: 'name' | 'value', value: string) => void;
  getVariablesAsRecord: (type: VariableType) => Record<string, string>;
  loadMinimalTemplate: () => void;
  loadFullTemplate: () => void;
  loadBlankTemplate: () => void;
}

const DEFAULT_COLORS: Variable[] = [
  { id: '1', name: 'primary', value: '221.2 83.2% 53.3%' },
  { id: '2', name: 'secondary', value: '210 40% 96.1%' },
  { id: '3', name: 'accent', value: '142.1 76.2% 36.3%' },
  { id: '4', name: 'background', value: '0 0% 100%' },
  { id: '5', name: 'foreground', value: '222.2 84% 4.9%' },
  { id: '6', name: 'color-1', value: '' },
  { id: '7', name: 'color-2', value: '' },
];

const DEFAULT_SPACING: Variable[] = [
  { id: '1', name: 'xs', value: '0.5rem' },
  { id: '2', name: 'sm', value: '0.75rem' },
  { id: '3', name: 'md', value: '1rem' },
  { id: '4', name: 'lg', value: '1.5rem' },
  { id: '5', name: 'xl', value: '2rem' },
  { id: '6', name: 'spacing-1', value: '' },
  { id: '7', name: 'spacing-2', value: '' },
];

const DEFAULT_TYPOGRAPHY: Variable[] = [
  { id: '1', name: 'font-sans', value: 'Inter, system-ui, sans-serif' },
  { id: '2', name: 'font-serif', value: 'Georgia, serif' },
  { id: '3', name: 'font-mono', value: 'JetBrains Mono, monospace' },
  { id: '4', name: 'font-size-sm', value: '0.875rem' },
  { id: '5', name: 'font-size-base', value: '1rem' },
  { id: '6', name: 'font-size-lg', value: '1.125rem' },
  { id: '7', name: 'font-1', value: '' },
];

const DEFAULT_BORDER_RADIUS: Variable[] = [
  { id: '1', name: 'radius-sm', value: '0.375rem' },
  { id: '2', name: 'radius-md', value: '0.5rem' },
  { id: '3', name: 'radius-lg', value: '0.75rem' },
  { id: '4', name: 'radius-xl', value: '1rem' },
  { id: '5', name: 'radius-1', value: '' },
];

const DEFAULT_SHADOWS: Variable[] = [
  { id: '1', name: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { id: '2', name: 'shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  { id: '3', name: 'shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
  { id: '4', name: 'shadow-1', value: '' },
];

export function useVariables(): UseVariablesReturn {
  const [colors, setColors] = useState<Variable[]>(DEFAULT_COLORS);
  const [spacing, setSpacing] = useState<Variable[]>(DEFAULT_SPACING);
  const [typography, setTypography] = useState<Variable[]>(DEFAULT_TYPOGRAPHY);
  const [borderRadius, setBorderRadius] = useState<Variable[]>(DEFAULT_BORDER_RADIUS);
  const [shadows, setShadows] = useState<Variable[]>(DEFAULT_SHADOWS);

  const getSetterForType = useCallback((type: VariableType) => {
    switch (type) {
      case 'colors': return setColors;
      case 'spacing': return setSpacing;
      case 'typography': return setTypography;
      case 'borderRadius': return setBorderRadius;
      case 'shadows': return setShadows;
    }
  }, []);

  const getBaseNameForType = (type: VariableType): string => {
    switch (type) {
      case 'colors': return 'color';
      case 'spacing': return 'spacing';
      case 'typography': return 'font';
      case 'borderRadius': return 'radius';
      case 'shadows': return 'shadow';
    }
  };

  const addVariable = useCallback((type: VariableType) => {
    const setter = getSetterForType(type);
    const baseName = getBaseNameForType(type);
    const newId = Date.now().toString();

    setter((prev) => [
      ...prev,
      { id: newId, name: `${baseName}-${prev.length + 1}`, value: '' },
    ]);
  }, [getSetterForType]);

  const removeVariable = useCallback((type: VariableType, id: string) => {
    const setter = getSetterForType(type);
    setter((prev) => prev.filter((v) => v.id !== id));
  }, [getSetterForType]);

  const updateVariable = useCallback(
    (type: VariableType, id: string, field: 'name' | 'value', value: string) => {
      const setter = getSetterForType(type);
      setter((prev) =>
        prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
      );
    },
    [getSetterForType]
  );

  const getVariablesAsRecord = useCallback((type: VariableType): Record<string, string> => {
    let variables: Variable[];
    switch (type) {
      case 'colors': variables = colors; break;
      case 'spacing': variables = spacing; break;
      case 'typography': variables = typography; break;
      case 'borderRadius': variables = borderRadius; break;
      case 'shadows': variables = shadows; break;
    }
    return variables
      .filter((v) => v.value.trim())
      .reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {});
  }, [colors, spacing, typography, borderRadius, shadows]);

  const loadMinimalTemplate = useCallback(() => {
    setColors([
      { id: '1', name: 'primary', value: '221.2 83.2% 53.3%' },
      { id: '2', name: 'background', value: '0 0% 100%' },
      { id: '3', name: 'foreground', value: '222.2 84% 4.9%' },
    ]);
    setSpacing([
      { id: '1', name: 'sm', value: '0.5rem' },
      { id: '2', name: 'md', value: '1rem' },
      { id: '3', name: 'lg', value: '2rem' },
    ]);
    setTypography([
      { id: '1', name: 'font-sans', value: 'Inter, system-ui, sans-serif' },
    ]);
    setBorderRadius([{ id: '1', name: 'radius-md', value: '0.5rem' }]);
    setShadows([
      { id: '1', name: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    ]);
  }, []);

  const loadFullTemplate = useCallback(() => {
    setColors(DEFAULT_COLORS);
    setSpacing(DEFAULT_SPACING);
    setTypography(DEFAULT_TYPOGRAPHY);
    setBorderRadius(DEFAULT_BORDER_RADIUS);
    setShadows(DEFAULT_SHADOWS);
  }, []);

  const loadBlankTemplate = useCallback(() => {
    setColors([{ id: '1', name: 'variable-1', value: '' }]);
    setSpacing([{ id: '1', name: 'spacing-1', value: '' }]);
    setTypography([{ id: '1', name: 'font-1', value: '' }]);
    setBorderRadius([{ id: '1', name: 'radius-1', value: '' }]);
    setShadows([{ id: '1', name: 'shadow-1', value: '' }]);
  }, []);

  return {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    setColors,
    setSpacing,
    setTypography,
    setBorderRadius,
    setShadows,
    addVariable,
    removeVariable,
    updateVariable,
    getVariablesAsRecord,
    loadMinimalTemplate,
    loadFullTemplate,
    loadBlankTemplate,
  };
}
