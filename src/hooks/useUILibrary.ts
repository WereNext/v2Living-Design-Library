import { createContext, useContext } from 'react';
import { UILibrary, UI_LIBRARIES } from '../lib/constants';

interface UILibraryContextType {
  library: UILibrary;
  isLoading: boolean;
}

export const UILibraryContext = createContext<UILibraryContextType>({
  library: UI_LIBRARIES.SHADCN,
  isLoading: false,
});

export function useUILibrary() {
  return useContext(UILibraryContext);
}
