/**
 * Dynamic syntax highlighting theme that respects CSS custom properties
 * Used by code preview components throughout the app
 */
export function createSyntaxTheme(): Record<string, React.CSSProperties> {
  const root = getComputedStyle(document.documentElement);
  const background = root.getPropertyValue('--card').trim() || '#ffffff';
  const foreground = root.getPropertyValue('--foreground').trim() || '#000000';
  const muted = root.getPropertyValue('--muted-foreground').trim() || '#6b7280';
  const primary = root.getPropertyValue('--primary').trim() || '#000000';

  const baseStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '0.875rem',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.6',
    tabSize: 2,
    hyphens: 'none',
  };

  return {
    'code[class*="language-"]': {
      ...baseStyle,
      color: foreground,
      background: background,
    },
    'pre[class*="language-"]': {
      ...baseStyle,
      color: foreground,
      background: background,
      padding: '1em',
      margin: '0',
      overflow: 'auto',
    },
    'comment': { color: muted, fontStyle: 'italic' },
    'prolog': { color: muted },
    'doctype': { color: muted },
    'cdata': { color: muted },
    'punctuation': { color: muted },
    'namespace': { opacity: 0.7 },
    'property': { color: primary },
    'tag': { color: primary },
    'boolean': { color: primary },
    'number': { color: primary },
    'constant': { color: primary },
    'symbol': { color: primary },
    'deleted': { color: '#ef4444' },
    'selector': { color: '#10b981' },
    'attr-name': { color: '#10b981' },
    'string': { color: '#10b981' },
    'char': { color: '#10b981' },
    'builtin': { color: '#10b981' },
    'inserted': { color: '#10b981' },
    'operator': { color: muted },
    'entity': { color: '#8b5cf6', cursor: 'help' },
    'url': { color: '#8b5cf6' },
    'atrule': { color: '#f59e0b' },
    'attr-value': { color: '#f59e0b' },
    'keyword': { color: '#ec4899' },
    'function': { color: '#0ea5e9' },
    'class-name': { color: '#f59e0b' },
    'regex': { color: '#f97316' },
    'important': { color: '#ef4444', fontWeight: 'bold' },
    'variable': { color: '#8b5cf6' },
    'bold': { fontWeight: 'bold' },
    'italic': { fontStyle: 'italic' },
  };
}
