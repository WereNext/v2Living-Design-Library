import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  GitBranch, 
  Clock, 
  User, 
  FileText, 
  Download, 
  RotateCcw, 
  TrendingUp,
  Plus,
  Minus,
  Edit,
  ArrowRight,
  History,
  GitCommit
} from 'lucide-react';
import { DesignSystemVersion, VersionType } from '../types/version';
import { 
  incrementVersion, 
  compareVersionSnapshots, 
  generateChangelog,
  getLatestVersion 
} from '../lib/version-utilities';
import { toast } from 'sonner@2.0.3';
import { ScrollArea } from './ui/scroll-area';

interface VersionManagerProps {
  versions: DesignSystemVersion[];
  currentVersion?: DesignSystemVersion;
  systemName: string;
  onCreateVersion: (versionType: VersionType, notes: string, author?: string) => void;
  onRestoreVersion: (version: DesignSystemVersion) => void;
  onExportVersion: (version: DesignSystemVersion) => void;
  onDeleteVersion?: (versionId: string) => void;
}

export function VersionManager({
  versions,
  currentVersion,
  systemName,
  onCreateVersion,
  onRestoreVersion,
  onExportVersion,
  onDeleteVersion,
}: VersionManagerProps) {
  const [open, setOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [versionType, setVersionType] = useState<VersionType>('patch');
  const [notes, setNotes] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<DesignSystemVersion | null>(null);
  const [compareFrom, setCompareFrom] = useState<string>('');
  const [compareTo, setCompareTo] = useState<string>('');

  const latestVersion = getLatestVersion(versions);
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleCreateVersion = () => {
    if (!notes.trim()) {
      toast.error('Please provide release notes');
      return;
    }
    
    onCreateVersion(versionType, notes, author || undefined);
    setNotes('');
    setAuthor('');
    setCreateDialogOpen(false);
    toast.success(`Version created successfully!`);
  };

  const handleCompare = () => {
    if (!compareFrom || !compareTo) {
      toast.error('Please select two versions to compare');
      return;
    }

    const fromVer = versions.find(v => v.id === compareFrom);
    const toVer = versions.find(v => v.id === compareTo);

    if (!fromVer || !toVer) return;

    const comparison = compareVersionSnapshots(fromVer, toVer);
    setSelectedVersion({
      ...toVer,
      notes: `Comparison from ${fromVer.version} to ${toVer.version}\n\n` +
        `✨ Added: ${comparison.summary.added}\n` +
        `🔧 Modified: ${comparison.summary.modified}\n` +
        `🗑️ Removed: ${comparison.summary.removed}`,
      changes: comparison.changes,
    });
  };

  const getVersionTypeColor = (type: string) => {
    if (type.startsWith('0.0.')) return 'bg-blue-500';
    if (type.startsWith('0.')) return 'bg-green-500';
    return 'bg-purple-500';
  };

  const getChangeIcon = (type: 'added' | 'modified' | 'removed') => {
    switch (type) {
      case 'added': return <Plus className="w-3 h-3 text-green-600" />;
      case 'modified': return <Edit className="w-3 h-3 text-blue-600" />;
      case 'removed': return <Minus className="w-3 h-3 text-red-600" />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Versions
            {versions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {latestVersion?.version || '0.0.0'}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Version History - {systemName}
            </DialogTitle>
            <DialogDescription>
              View, compare, and restore previous versions of your design system
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Button onClick={() => setCreateDialogOpen(true)} size="sm">
              <GitCommit className="w-4 h-4 mr-2" />
              Create New Version
            </Button>
            <Button onClick={() => setCompareDialogOpen(true)} variant="outline" size="sm">
              <ArrowRight className="w-4 h-4 mr-2" />
              Compare Versions
            </Button>
          </div>

          <ScrollArea className="flex-1 pr-4">
            {versions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground py-8">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No versions yet</p>
                    <p className="text-sm mt-2">Create your first version to start tracking changes</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedVersions.map((version, index) => {
                  const isLatest = index === 0;
                  const isCurrent = currentVersion?.id === version.id;

                  return (
                    <Card key={version.id} className={isCurrent ? 'border-2 border-primary' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${getVersionTypeColor(version.version)}`} />
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                v{version.version}
                                {isLatest && (
                                  <Badge variant="secondary">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Latest
                                  </Badge>
                                )}
                                {isCurrent && (
                                  <Badge className="bg-green-600">Current</Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(version.timestamp).toLocaleString()}
                                </span>
                                {version.author && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {version.author}
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVersion(version)}
                            >
                              <FileText className="w-3.5 h-3.5 mr-2" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                onExportVersion(version);
                                toast.success('Version exported!');
                              }}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                            {!isCurrent && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  onRestoreVersion(version);
                                  toast.success(`Restored to version ${version.version}`);
                                  setOpen(false);
                                }}
                              >
                                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                                Restore
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {version.notes && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{version.notes}</p>
                          
                          {version.changes.length > 0 && (
                            <div className="mt-3 flex items-center gap-4 text-xs">
                              {version.changes.filter(c => c.type === 'added').length > 0 && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <Plus className="w-3 h-3" />
                                  {version.changes.filter(c => c.type === 'added').length} added
                                </span>
                              )}
                              {version.changes.filter(c => c.type === 'modified').length > 0 && (
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Edit className="w-3 h-3" />
                                  {version.changes.filter(c => c.type === 'modified').length} modified
                                </span>
                              )}
                              {version.changes.filter(c => c.type === 'removed').length > 0 && (
                                <span className="flex items-center gap-1 text-red-600">
                                  <Minus className="w-3 h-3" />
                                  {version.changes.filter(c => c.type === 'removed').length} removed
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Create Version Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Save the current state as a new version with release notes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Version Type</Label>
              <Select value={versionType} onValueChange={(v) => setVersionType(v as VersionType)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">
                    <div className="flex flex-col items-start">
                      <span>Major (X.0.0)</span>
                      <span className="text-xs text-muted-foreground">Breaking changes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="minor">
                    <div className="flex flex-col items-start">
                      <span>Minor (0.X.0)</span>
                      <span className="text-xs text-muted-foreground">New features</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="patch">
                    <div className="flex flex-col items-start">
                      <span>Patch (0.0.X)</span>
                      <span className="text-xs text-muted-foreground">Bug fixes & tweaks</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Next version: <span className="font-semibold">
                  {incrementVersion(latestVersion?.version || '0.0.0', versionType)}
                </span>
              </p>
            </div>

            <div>
              <Label htmlFor="version-notes">Release Notes *</Label>
              <Textarea
                id="version-notes"
                placeholder="Describe what changed in this version..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 h-24"
              />
            </div>

            <div>
              <Label htmlFor="version-author">Author (Optional)</Label>
              <Input
                id="version-author"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateVersion}>
                Create Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare Versions Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Select two versions to see what changed between them
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>From Version</Label>
              <Select value={compareFrom} onValueChange={setCompareFrom}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select older version" />
                </SelectTrigger>
                <SelectContent>
                  {sortedVersions.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.version} - {new Date(v.timestamp).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>To Version</Label>
              <Select value={compareTo} onValueChange={setCompareTo}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select newer version" />
                </SelectTrigger>
                <SelectContent>
                  {sortedVersions.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.version} - {new Date(v.timestamp).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCompareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompare}>
                Compare
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Details Dialog */}
      {selectedVersion && (
        <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Version {selectedVersion.version} Details</DialogTitle>
              <DialogDescription>
                Released {new Date(selectedVersion.timestamp).toLocaleString()}
                {selectedVersion.author && ` by ${selectedVersion.author}`}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {selectedVersion.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Release Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedVersion.notes}
                    </p>
                  </div>
                )}
                
                {selectedVersion.changes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Changes</h4>
                    <div className="space-y-2">
                      {selectedVersion.changes.map((change, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm p-2 rounded bg-muted/50">
                          {getChangeIcon(change.type)}
                          <div className="flex-1">
                            <p className="font-medium">{change.description || change.path}</p>
                            {change.oldValue !== undefined && change.newValue !== undefined && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="line-through">{JSON.stringify(change.oldValue)}</span>
                                {' → '}
                                <span>{JSON.stringify(change.newValue)}</span>
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {change.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Changelog</h4>
                  <pre className="text-xs bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
                    {generateChangelog(selectedVersion)}
                  </pre>
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  const changelog = generateChangelog(selectedVersion);
                  navigator.clipboard.writeText(changelog);
                  toast.success('Changelog copied to clipboard!');
                }}
              >
                Copy Changelog
              </Button>
              <Button onClick={() => setSelectedVersion(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
