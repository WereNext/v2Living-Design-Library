/**
 * Image Library Component
 * 
 * Browse, search, and manage uploaded images
 */

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Search, 
  Image as ImageIcon, 
  Trash2, 
  Download,
  Copy,
  Eye,
  X,
  Filter,
  Grid3x3,
  List,
  Upload as UploadIcon
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import { getImageStorage, type StoredImage } from '../lib/image-storage';
import { ImageOptimizer } from '../lib/image-optimizer';
import { ImageUploader } from './ImageUploader';

interface ImageLibraryProps {
  selectionMode?: boolean;
  onImageSelect?: (image: StoredImage) => void;
  maxSelection?: number;
}

export function ImageLibrary({ 
  selectionMode = false,
  onImageSelect,
  maxSelection = 1,
}: ImageLibraryProps) {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<StoredImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewImage, setPreviewImage] = useState<StoredImage | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalSize: 0,
    byFormat: {} as Record<string, number>,
  });

  useEffect(() => {
    loadImages();
    loadStats();
  }, []);

  useEffect(() => {
    filterImages();
  }, [searchTerm, images]);

  const loadImages = async () => {
    const storage = getImageStorage();
    const loaded = await storage.getAll();
    setImages(loaded);
  };

  const loadStats = async () => {
    const storage = getImageStorage();
    const statsData = await storage.getStats();
    setStats(statsData);
  };

  const filterImages = () => {
    if (!searchTerm) {
      setFilteredImages(images);
      return;
    }

    const storage = getImageStorage();
    storage.search(searchTerm).then(results => {
      setFilteredImages(results);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const storage = getImageStorage();
      await storage.delete(id);
      
      setImages(prev => prev.filter(img => img.id !== id));
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      toast.success('Image deleted');
      loadStats();
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleCopyUrl = (image: StoredImage) => {
    navigator.clipboard.writeText(image.dataUrl);
    toast.success('Image URL copied to clipboard');
  };

  const handleDownload = (image: StoredImage) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `${image.name}.${image.format}`;
    link.click();
    toast.success('Image downloaded');
  };

  const handleSelectImage = (image: StoredImage) => {
    if (!selectionMode) {
      setPreviewImage(image);
      return;
    }

    if (selectedImages.has(image.id)) {
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(image.id);
        return newSet;
      });
    } else if (selectedImages.size < maxSelection) {
      setSelectedImages(prev => new Set(prev).add(image.id));
    } else {
      toast.error(`You can only select up to ${maxSelection} image${maxSelection > 1 ? 's' : ''}`);
    }
  };

  const handleConfirmSelection = () => {
    if (onImageSelect && selectedImages.size > 0) {
      const selected = images.filter(img => selectedImages.has(img.id));
      selected.forEach(img => onImageSelect(img));
    }
  };

  const handleUploadComplete = () => {
    loadImages();
    loadStats();
    setShowUploader(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Image Library
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.total} images ({ImageOptimizer.formatSize(stats.totalSize)})
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </Button>
            <Button size="sm" onClick={() => setShowUploader(true)}>
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search images..."
            className="pl-9"
          />
        </div>

        {/* Format Stats */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.byFormat).map(([format, count]) => (
            <Badge key={format} variant="outline" className="text-xs">
              {format.toUpperCase()}: {count}
            </Badge>
          ))}
        </div>
      </div>

      {/* Image Grid/List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">No images yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first image to get started
              </p>
              <Button onClick={() => setShowUploader(true)}>
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map(image => (
                <ImageCard
                  key={image.id}
                  image={image}
                  selected={selectedImages.has(image.id)}
                  onSelect={() => handleSelectImage(image)}
                  onDelete={() => handleDelete(image.id)}
                  onCopy={() => handleCopyUrl(image)}
                  onDownload={() => handleDownload(image)}
                  selectionMode={selectionMode}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map(image => (
                <ImageListItem
                  key={image.id}
                  image={image}
                  selected={selectedImages.has(image.id)}
                  onSelect={() => handleSelectImage(image)}
                  onDelete={() => handleDelete(image.id)}
                  onCopy={() => handleCopyUrl(image)}
                  onDownload={() => handleDownload(image)}
                  selectionMode={selectionMode}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selection Mode Footer */}
      {selectionMode && selectedImages.size > 0 && (
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedImages(new Set())}>
                Clear
              </Button>
              <Button onClick={handleConfirmSelection}>
                Use Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{previewImage.name}</DialogTitle>
            </DialogHeader>
            <ImagePreview 
              image={previewImage}
              onClose={() => setPreviewImage(null)}
              onDelete={() => {
                handleDelete(previewImage.id);
                setPreviewImage(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Dialog */}
      {showUploader && (
        <Dialog open={showUploader} onOpenChange={setShowUploader}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Images</DialogTitle>
            </DialogHeader>
            <ImageUploader onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/**
 * Image Card (Grid View)
 */
interface ImageCardProps {
  image: StoredImage;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onDownload: () => void;
  selectionMode: boolean;
}

function ImageCard({ 
  image, 
  selected, 
  onSelect, 
  onDelete, 
  onCopy, 
  onDownload,
  selectionMode 
}: ImageCardProps) {
  return (
    <div 
      className={`
        group relative border rounded-lg overflow-hidden cursor-pointer
        transition-all hover:border-primary/50
        ${selected ? 'ring-2 ring-primary' : ''}
      `}
      onClick={onSelect}
    >
      {/* Image */}
      <div className="aspect-square bg-muted relative">
        <img
          src={image.thumbnail || image.dataUrl}
          alt={image.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
          >
            <Download className="w-3 h-3" />
          </Button>
          {!selectionMode && (
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Selection Indicator */}
        {selected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
            <Eye className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-sm font-medium truncate">{image.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{image.width}×{image.height}</span>
          <span>•</span>
          <span>{ImageOptimizer.formatSize(image.size)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Image List Item (List View)
 */
function ImageListItem({ 
  image, 
  selected, 
  onSelect, 
  onDelete, 
  onCopy, 
  onDownload,
  selectionMode 
}: ImageCardProps) {
  return (
    <div
      className={`
        flex items-center gap-4 p-3 border rounded-lg cursor-pointer
        transition-all hover:border-primary/50
        ${selected ? 'ring-2 ring-primary' : ''}
      `}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded border bg-muted overflow-hidden flex-shrink-0">
        <img
          src={image.thumbnail || image.dataUrl}
          alt={image.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{image.name}</p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
          <span>{image.width}×{image.height}</span>
          <span>{ImageOptimizer.formatSize(image.size)}</span>
          <Badge variant="outline" className="text-xs">
            {image.format.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
        >
          <Download className="w-4 h-4" />
        </Button>
        {!selectionMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Image Preview (Detail View)
 */
interface ImagePreviewProps {
  image: StoredImage;
  onClose: () => void;
  onDelete: () => void;
}

function ImagePreview({ image, onClose, onDelete }: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      {/* Image */}
      <div className="bg-muted rounded-lg overflow-hidden">
        <img
          src={image.dataUrl}
          alt={image.name}
          className="w-full h-auto max-h-[60vh] object-contain"
        />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Dimensions</p>
          <p className="font-medium">{image.width} × {image.height}px</p>
        </div>
        <div>
          <p className="text-muted-foreground">Size</p>
          <p className="font-medium">{ImageOptimizer.formatSize(image.size)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Format</p>
          <p className="font-medium">{image.format.toUpperCase()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Uploaded</p>
          <p className="font-medium">
            {new Date(image.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            navigator.clipboard.writeText(image.dataUrl);
            toast.success('Image URL copied');
          }}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy URL
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            const link = document.createElement('a');
            link.href = image.dataUrl;
            link.download = `${image.name}.${image.format}`;
            link.click();
            toast.success('Image downloaded');
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
