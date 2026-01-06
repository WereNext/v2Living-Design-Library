/**
 * Ant Design Theme Provider wrapper
 * Applies Living Design Library tokens to Ant Design components
 */
import { ReactNode, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import type { Theme } from '../../hooks/useDesignSystems';
import { mapTokensToAntd } from '../../lib/theme-mappers/antd-mapper';

interface AntDesignProviderProps {
  theme: Theme | null;
  children: ReactNode;
}

export default function AntDesignProvider({ theme, children }: AntDesignProviderProps) {
  const antdTheme = useMemo(() => {
    if (!theme) {
      return {};
    }
    return mapTokensToAntd(theme);
  }, [theme]);

  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}
