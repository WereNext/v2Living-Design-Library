import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, Download, Eye, Check, Palette, Calendar, Sparkles, Layers } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { DesignSystem } from '../hooks/useDesignSystems';
import { VersionManager } from './VersionManager';

interface SavedDesignSystemsProps {
  systems: DesignSystem[];
  activeSystemId?: string;
  onApply: (system: DesignSystem) => void;
  onDelete: (id: string) => void;
  onExport: (system: DesignSystem) => void;
  onCreateVersion: (systemId: string, versionType: 'major' | 'minor' | 'patch', notes: string, author?: string) => void;
  onRestoreVersion: (systemId: string, version: any) => void;
  onExportVersion: (version: any) => void;
  onDeleteVersion?: (systemId: string, versionId: string) => void;
}

export function SavedDesignSystems({ 
  systems, 
  activeSystemId, 
  onApply, 
  onDelete,
  onExport,
  onCreateVersion,
  onRestoreVersion,
  onExportVersion,
  onDeleteVersion
}: SavedDesignSystemsProps) {
  const [previewId, setPreviewId] = useState<string | null>(null);

  const getSystemStats = (system: DesignSystem) => {
    // Get stats from the first/active theme
    if (!system.themes || system.themes.length === 0) {
      return { colors: 0, spacing: 0, typography: 0, borderRadius: 0, shadows: 0 };
    }
    
    const activeTheme = system.themes.find(t => t.id === system.activeThemeId) || system.themes[0];
    if (!activeTheme) return { colors: 0, spacing: 0, typography: 0, borderRadius: 0, shadows: 0 };
    
    return {
      colors: Object.keys(activeTheme.colors || {}).length,
      spacing: Object.keys(activeTheme.spacing || {}).length,
      typography: Object.keys(activeTheme.typography || {}).length,
      borderRadius: Object.keys(activeTheme.borderRadius || {}).length,
      shadows: Object.keys(activeTheme.shadows || {}).length
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (systems.length === 0) {
    return (
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          No saved design systems yet. Create your first design system using the builder above!
        </AlertDescription>
      </Alert>
    );
  }

  const previewedSystem = previewId ? systems.find(s => s.id === previewId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Design Systems</h3>
        <Badge variant="secondary">{systems.length} System{systems.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {systems.map((system) => {
          const stats = getSystemStats(system);
          const isActive = system.id === activeSystemId;
          const isPreviewed = system.id === previewId;

          return (
            <Card 
              key={system.id} 
              className={`relative ${isActive ? 'border-2 border-primary bg-primary/5' : ''} ${isPreviewed ? 'ring-2 ring-purple-400' : ''}`}
            >
              {isActive && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {system.name}
                </CardTitle>
                {system.description && (
                  <CardDescription className="text-xs line-clamp-2">
                    {system.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Themes Section - Show all themes in this system */}
                {system.themes && system.themes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold">{system.themes.length} Theme{system.themes.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {system.themes.map((theme) => (
                        <Badge 
                          key={theme.id} 
                          variant={theme.id === system.activeThemeId ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {theme.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-5 gap-1 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-primary">{stats.colors}</div>
                    <div className="text-muted-foreground">Colors</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{stats.spacing}</div>
                    <div className="text-muted-foreground">Space</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{stats.typography}</div>
                    <div className="text-muted-foreground">Type</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{stats.borderRadius}</div>
                    <div className="text-muted-foreground">Radius</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{stats.shadows}</div>
                    <div className="text-muted-foreground">Shadow</div>
                  </div>
                </div>

                {/* Color Preview Swatches */}
                {(() => {
                  if (!system.themes || system.themes.length === 0) return null;
                  const activeTheme = system.themes.find(t => t.id === system.activeThemeId) || system.themes[0];
                  if (!activeTheme || !activeTheme.colors || Object.keys(activeTheme.colors).length === 0) return null;
                  
                  return (
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(activeTheme.colors).slice(0, 8).map(([name, value]) => (
                        <div
                          key={name}
                          className="w-6 h-6 rounded border border-border"
                          style={{ background: `hsl(${value})` }}
                          title={name}
                        />
                      ))}
                      {Object.keys(activeTheme.colors).length > 8 && (
                        <div className="w-6 h-6 rounded border border-border bg-muted flex items-center justify-center text-[9px] text-muted-foreground">
                          +{Object.keys(activeTheme.colors).length - 8}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Calendar className="w-3 h-3" />
                  {formatDate(system.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant={isActive ? "secondary" : "default"}
                    size="sm"
                    onClick={() => onApply(system)}
                    disabled={isActive}
                    className="flex-1"
                  >
                    {isActive ? 'Applied' : 'Apply'}
                  </Button>
                  
                  {/* Version Manager - only show for user-created systems */}
                  {!['default-system', 'material-system', 'minimalist-system'].includes(system.id) && (
                    <VersionManager
                      versions={system.versions || []}
                      currentVersion={system.versions?.find(v => v.id === system.currentVersionId)}
                      systemName={system.name}
                      onCreateVersion={(versionType, notes, author) => 
                        onCreateVersion(system.id, versionType, notes, author)
                      }
                      onRestoreVersion={(version) => onRestoreVersion(system.id, version)}
                      onExportVersion={onExportVersion}
                      onDeleteVersion={onDeleteVersion ? (versionId) => onDeleteVersion(system.id, versionId) : undefined}
                    />
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewId(isPreviewed ? null : system.id)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(system)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                  {/* Only show delete button for non-prebuilt systems */}
                  {!['default-system', 'material-system', 'minimalist-system'].includes(system.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete "${system.name}"? This cannot be undone.`)) {
                          onDelete(system.id);
                        }
                      }}
                      disabled={isActive}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Panel */}
      {previewedSystem && (() => {
        if (!previewedSystem.themes || previewedSystem.themes.length === 0) return null;
        const activeTheme = previewedSystem.themes.find(t => t.id === previewedSystem.activeThemeId) || previewedSystem.themes[0];
        if (!activeTheme) return null;

        return (
          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview: {previewedSystem.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Colors */}
              {activeTheme.colors && Object.keys(activeTheme.colors).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Colors ({Object.keys(activeTheme.colors).length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(activeTheme.colors).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border-2 border-border flex-shrink-0"
                          style={{ background: `hsl(${value})` }}
                        />
                        <div className="text-xs">
                          <div className="font-mono font-semibold">{name}</div>
                          <div className="text-muted-foreground">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacing */}
              {activeTheme.spacing && Object.keys(activeTheme.spacing).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Spacing ({Object.keys(activeTheme.spacing).length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {Object.entries(activeTheme.spacing).map(([name, value]) => (
                      <div key={name} className="font-mono">
                        <span className="font-semibold">{name}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Typography */}
              {activeTheme.typography && Object.keys(activeTheme.typography).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Typography ({Object.keys(activeTheme.typography).length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {Object.entries(activeTheme.typography).map(([name, value]) => (
                      <div key={name} className="font-mono">
                        <span className="font-semibold">{name}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewId(null)}
                className="w-full"
              >
                Close Preview
              </Button>
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}