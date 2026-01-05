import { useEffect, useState, useCallback } from 'react';
import type { ColorTheme, FontFamily, VisualFeel } from '../components/ThemeCustomizer';

export function useTheme() {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('glassmorphism');
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('inter');
  const [visualFeel, setVisualFeelState] = useState<VisualFeel>('minimal');

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
  }, []);

  const setFontFamily = useCallback((font: FontFamily) => {
    setFontFamilyState(font);
  }, []);

  const setVisualFeel = useCallback((feel: VisualFeel) => {
    setVisualFeelState(feel);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove(
      'theme-neo', 'theme-brutalist', 'theme-glassmorphism', 'theme-candy', 'theme-material', 'theme-minimal',
      'font-inter', 'font-spaceGrotesk', 'font-jetbrainsMono', 'font-poppins', 'font-playfairDisplay', 'font-manrope', 'font-system', 'font-helvetica', 'font-avenir', 'font-georgia',
      'feel-modern', 'feel-classic', 'feel-playful', 'feel-minimal', 'feel-bold'
    );
    
    // Apply current theme classes
    // IMPORTANT: We DON'T apply font classes to root - this prevents theme fonts from affecting the UI
    root.classList.add(`theme-${colorTheme}`);
    // REMOVED: root.classList.add(`font-${fontFamily}`); // Don't apply font to root!
    root.classList.add(`feel-${visualFeel}`);
  }, [colorTheme, fontFamily, visualFeel]);

  return {
    colorTheme,
    fontFamily,
    visualFeel,
    setColorTheme,
    setFontFamily,
    setVisualFeel,
  };
}