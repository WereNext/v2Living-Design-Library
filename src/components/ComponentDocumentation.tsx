import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import {
  BookOpen,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Download,
  Eye,
  Code,
  Lightbulb,
  Accessibility,
  FileText,
  Tag,
  Calendar,
  User
} from 'lucide-react';
import { ComponentDocumentation as ComponentDocType, DOCUMENTATION_TEMPLATES } from '../types/documentation';
import { toast } from 'sonner@2.0.3';

interface ComponentDocumentationProps {
  componentId: string;
  componentName: string;
  documentation?: ComponentDocType;
  onSave: (doc: Omit<ComponentDocType, 'id' | 'lastUpdated'>) => void;
  onDelete?: () => void;
}

export function ComponentDocumentation({
  componentId,
  componentName,
  documentation,
  onSave,
  onDelete
}: ComponentDocumentationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [overview, setOverview] = useState(documentation?.overview || '');
  const [whenToUse, setWhenToUse] = useState(documentation?.whenToUse || '');
  const [bestPractices, setBestPractices] = useState<string[]>(documentation?.bestPractices || []);
  const [newPractice, setNewPractice] = useState('');
  const [accessibility, setAccessibility] = useState(documentation?.accessibility || '');
  const [designNotes, setDesignNotes] = useState(documentation?.designNotes || '');
  const [author, setAuthor] = useState(documentation?.author || '');
  const [tags, setTags] = useState<string[]>(documentation?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [customSections, setCustomSections] = useState(documentation?.customSections || []);
  const [codeExamples, setCodeExamples] = useState(documentation?.codeExamples || []);

  const hasDocumentation = documentation && (
    documentation.overview ||
    documentation.whenToUse ||
    (documentation.bestPractices && documentation.bestPractices.length > 0) ||
    documentation.accessibility ||
    documentation.designNotes
  );

  const handleSave = () => {
    onSave({
      componentId,
      componentName,
      overview: overview || undefined,
      whenToUse: whenToUse || undefined,
      bestPractices: bestPractices.length > 0 ? bestPractices : undefined,
      accessibility: accessibility || undefined,
      designNotes: designNotes || undefined,
      author: author || undefined,
      tags: tags.length > 0 ? tags : undefined,
      customSections: customSections.length > 0 ? customSections : undefined,
      codeExamples: codeExamples.length > 0 ? codeExamples : undefined
    });
    setIsEditing(false);
    toast.success('Documentation saved!');
  };

  const handleCancel = () => {
    // Reset to original values
    setOverview(documentation?.overview || '');
    setWhenToUse(documentation?.whenToUse || '');
    setBestPractices(documentation?.bestPractices || []);
    setAccessibility(documentation?.accessibility || '');
    setDesignNotes(documentation?.designNotes || '');
    setAuthor(documentation?.author || '');
    setTags(documentation?.tags || []);
    setCustomSections(documentation?.customSections || []);
    setCodeExamples(documentation?.codeExamples || []);
    setIsEditing(false);
  };

  const addBestPractice = () => {
    if (newPractice.trim()) {
      setBestPractices([...bestPractices, newPractice.trim()]);
      setNewPractice('');
    }
  };

  const removeBestPractice = (index: number) => {
    setBestPractices(bestPractices.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addCustomSection = () => {
    setCustomSections([...customSections, { title: 'New Section', content: '' }]);
  };

  const updateCustomSection = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...customSections];
    updated[index] = { ...updated[index], [field]: value };
    setCustomSections(updated);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const addCodeExample = () => {
    setCodeExamples([...codeExamples, {
      id: `ex-${Date.now()}`,
      title: 'New Example',
      code: '',
      language: 'tsx'
    }]);
  };

  const updateCodeExample = (id: string, field: string, value: any) => {
    setCodeExamples(codeExamples.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeCodeExample = (id: string) => {
    setCodeExamples(codeExamples.filter(ex => ex.id !== id));
  };

  const loadTemplate = (templateId: string) => {
    const template = DOCUMENTATION_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      toast.success(`Loaded "${template.name}" template`);
    }
  };

  const exportMarkdown = () => {
    let markdown = `# ${componentName}\n\n`;
    
    if (overview) markdown += `## Overview\n\n${overview}\n\n`;
    if (whenToUse) markdown += `## When to Use\n\n${whenToUse}\n\n`;
    
    if (bestPractices.length > 0) {
      markdown += `## Best Practices\n\n`;
      bestPractices.forEach(p => markdown += `- ${p}\n`);
      markdown += '\n';
    }
    
    if (accessibility) markdown += `## Accessibility\n\n${accessibility}\n\n`;
    if (designNotes) markdown += `## Design Notes\n\n${designNotes}\n\n`;
    
    customSections.forEach(section => {
      markdown += `## ${section.title}\n\n${section.content}\n\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentId}-documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Documentation exported!');
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Component Documentation</CardTitle>
              <CardDescription className="text-xs mt-1">
                {hasDocumentation 
                  ? `Last updated ${documentation?.lastUpdated ? new Date(documentation.lastUpdated).toLocaleDateString() : 'never'}`
                  : 'No documentation yet - click to add'
                }
              </CardDescription>
            </div>
          </div>
          
          <div className="flex gap-2">
            {hasDocumentation && !isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-3.5 h-3.5 mr-2" />
                  {showPreview ? 'Hide' : 'View'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportMarkdown}
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            
            {!isEditing ? (
              <Button
                variant={hasDocumentation ? "outline" : "default"}
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-3.5 h-3.5 mr-2" />
                {hasDocumentation ? 'Edit' : 'Add Documentation'}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-3.5 h-3.5 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="w-3.5 h-3.5 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {(isEditing || showPreview) && (
        <CardContent>
          {isEditing ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="accessibility">A11y</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    placeholder="Brief description of this component and its purpose..."
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="mt-2 h-32"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports Markdown formatting
                  </p>
                </div>

                <div>
                  <Label htmlFor="designNotes">Design Notes</Label>
                  <Textarea
                    id="designNotes"
                    placeholder="Document design decisions, rationale, and considerations..."
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    className="mt-2 h-32"
                  />
                </div>

                {/* Custom Sections */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Custom Sections</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addCustomSection}
                    >
                      <Plus className="w-3.5 h-3.5 mr-2" />
                      Add Section
                    </Button>
                  </div>
                  
                  {customSections.map((section, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Section title"
                            value={section.title}
                            onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomSection(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Section content..."
                          value={section.content}
                          onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
                          className="h-24"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4">
                <div>
                  <Label htmlFor="whenToUse">When to Use</Label>
                  <Textarea
                    id="whenToUse"
                    placeholder="Describe scenarios and use cases for this component..."
                    value={whenToUse}
                    onChange={(e) => setWhenToUse(e.target.value)}
                    className="mt-2 h-32"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Best Practices</Label>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a best practice tip..."
                      value={newPractice}
                      onChange={(e) => setNewPractice(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addBestPractice()}
                    />
                    <Button onClick={addBestPractice} size="sm">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {bestPractices.map((practice, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                        <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                        <p className="flex-1 text-sm">{practice}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBestPractice(index)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4">
                <div>
                  <Label htmlFor="accessibility">Accessibility Guidelines</Label>
                  <Textarea
                    id="accessibility"
                    placeholder="Document ARIA labels, keyboard navigation, screen reader support, color contrast, etc..."
                    value={accessibility}
                    onChange={(e) => setAccessibility(e.target.value)}
                    className="mt-2 h-48"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include WCAG compliance notes, keyboard shortcuts, and assistive technology support
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Code Examples</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCodeExample}
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Add Example
                  </Button>
                </div>

                {codeExamples.map((example) => (
                  <Card key={example.id} className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Example title"
                          value={example.title}
                          onChange={(e) => updateCodeExample(example.id, 'title', e.target.value)}
                        />
                        <Select
                          value={example.language}
                          onValueChange={(v) => updateCodeExample(example.id, 'language', v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tsx">TSX</SelectItem>
                            <SelectItem value="jsx">JSX</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="javascript">JS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCodeExample(example.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      
                      <Input
                        placeholder="Description (optional)"
                        value={example.description || ''}
                        onChange={(e) => updateCodeExample(example.id, 'description', e.target.value)}
                      />
                      
                      <Textarea
                        placeholder="Paste code here..."
                        value={example.code}
                        onChange={(e) => updateCodeExample(example.id, 'code', e.target.value)}
                        className="font-mono text-xs h-32"
                      />
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="meta" className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Your name or team name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2 mb-3">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Load Template</Label>
                  <Select onValueChange={loadTemplate}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENTATION_TEMPLATES.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex flex-col items-start">
                            <span>{template.name}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // Preview Mode
            <ScrollArea className="max-h-[600px] pr-4">
              <div className="space-y-6">
                {overview && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Overview
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{overview}</p>
                  </div>
                )}

                {whenToUse && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      When to Use
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{whenToUse}</p>
                  </div>
                )}

                {bestPractices.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Best Practices</h4>
                    <ul className="space-y-2">
                      {bestPractices.map((practice, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                          <span className="text-muted-foreground">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {accessibility && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Accessibility className="w-4 h-4" />
                      Accessibility
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{accessibility}</p>
                  </div>
                )}

                {designNotes && (
                  <div>
                    <h4 className="font-semibold mb-2">Design Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{designNotes}</p>
                  </div>
                )}

                {codeExamples.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Code Examples
                    </h4>
                    <div className="space-y-4">
                      {codeExamples.map(example => (
                        <div key={example.id}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{example.title}</span>
                            <Badge variant="outline">{example.language}</Badge>
                          </div>
                          {example.description && (
                            <p className="text-xs text-muted-foreground mb-2">{example.description}</p>
                          )}
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customSections.map((section, i) => (
                  <div key={i}>
                    <h4 className="font-semibold mb-2">{section.title}</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}

                {(author || tags.length > 0) && (
                  <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                    {author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {author}
                      </span>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
}
