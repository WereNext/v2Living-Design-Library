/**
 * Image Uploader Component
 * 
 * Drag & drop and file browser image uploader with optimization
 */

import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import { ImageOptimizer, type OptimizedImage } from '../lib/image-optimizer';
import { getImageStorage, type StoredImage } from '../lib/image-storage';

interface ImageUploaderProps {
  onUploadComplete?: (images: StoredImage[]) => void;
  maxFiles?: number;
  autoOptimize?: boolean;
  showPreview?: boolean;
}

interface UploadingImage {
  id: string;
  file: File;
  status: 'uploading' | 'optimizing' | 'complete' | 'error';
  progress: number;
  preview?: string;
  optimized?: OptimizedImage;
  error?: string;
}

export function ImageUploader({
  onUploadComplete,
  maxFiles = 10,
  autoOptimize = true,
  showPreview = true,
}: ImageUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).slice(0, maxFiles);
    
    // Validate files
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const validation = ImageOptimizer.validate(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        toast.error(`${file.name}: ${validation.errors[0]}`);
      }
    }

    if (validFiles.length === 0) return;

    // Initialize uploading state
    const uploading: UploadingImage[] = validFiles.map(file => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      file,
      status: 'uploading',
      progress: 0,
    }));

    setUploadingImages(prev => [...prev, ...uploading]);

    // Process each file
    const results: StoredImage[] = [];
    
    for (const item of uploading) {
      try {
        // Update status: optimizing
        setUploadingImages(prev =>
          prev.map(img => img.id === item.id ? { ...img, status: 'optimizing', progress: 50 } : img)
        );

        // Optimize image
        let optimized: OptimizedImage;
        if (autoOptimize) {
          optimized = await ImageOptimizer.optimize(item.file);
        } else {
          // Just load without optimization
          const metadata = await ImageOptimizer.getMetadata(item.file);
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(item.file);
          });

          optimized = {
            dataUrl,
            width: metadata.width,
            height: metadata.height,
            size: metadata.size,
            format: metadata.type.split('/')[1],
            originalSize: metadata.size,
            compressionRatio: 1,
          };
        }

        // Create thumbnail
        const thumbnail = await ImageOptimizer.createThumbnail(item.file, 200);

        // Store in image library
        const storage = getImageStorage();
        const storedImage: StoredImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          dataUrl: optimized.dataUrl,
          width: optimized.width,
          height: optimized.height,
          size: optimized.size,
          format: optimized.format,
          thumbnail,
          uploadedAt: new Date().toISOString(),
          usageCount: 0,
        };

        await storage.store(storedImage);
        results.push(storedImage);

        // Update status: complete
        setUploadingImages(prev =>
          prev.map(img => 
            img.id === item.id 
              ? { ...img, status: 'complete', progress: 100, optimized, preview: thumbnail }
              : img
          )
        );

        toast.success(`${item.file.name} uploaded successfully`);

      } catch (error) {
        console.error('Failed to upload image:', error);
        
        setUploadingImages(prev =>
          prev.map(img => 
            img.id === item.id 
              ? { ...img, status: 'error', error: (error as Error).message }
              : img
          )
        );

        toast.error(`Failed to upload ${item.file.name}`);
      }
    }

    // Clear completed after delay
    setTimeout(() => {
      setUploadingImages(prev => prev.filter(img => img.status !== 'complete'));
    }, 3000);

    // Callback
    if (results.length > 0 && onUploadComplete) {
      onUploadComplete(results);
    }
  }, [maxFiles, autoOptimize, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeUpload = (id: string) => {
    setUploadingImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[0.98]' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-4 rounded-full transition-colors
            ${isDragging ? 'bg-primary/10' : 'bg-muted'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>

          <div>
            <p className="text-lg font-medium mb-1">
              {isDragging ? 'Drop images here' : 'Drag & drop images'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (max {maxFiles} files)
            </p>
          </div>

          <div className="flex gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">PNG</Badge>
            <Badge variant="outline">JPG</Badge>
            <Badge variant="outline">WebP</Badge>
            <Badge variant="outline">SVG</Badge>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingImages.length > 0 && (
        <div className="space-y-2">
          {uploadingImages.map(item => (
            <UploadProgress
              key={item.id}
              item={item}
              onRemove={removeUpload}
              showPreview={showPreview}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Upload Progress Item
 */
interface UploadProgressProps {
  item: UploadingImage;
  onRemove: (id: string) => void;
  showPreview: boolean;
}

function UploadProgress({ item, onRemove, showPreview }: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'uploading':
      case 'optimizing':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'uploading':
        return 'Uploading...';
      case 'optimizing':
        return 'Optimizing...';
      case 'complete':
        return item.optimized 
          ? `Complete (${ImageOptimizer.formatSize(item.optimized.size)}, ${item.optimized.compressionRatio.toFixed(1)}x compressed)`
          : 'Complete';
      case 'error':
        return item.error || 'Upload failed';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
      {/* Preview */}
      {showPreview && item.preview && (
        <div className="w-12 h-12 rounded overflow-hidden border bg-background flex-shrink-0">
          <img 
            src={item.preview} 
            alt={item.file.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {getStatusIcon()}
          <span className="text-sm font-medium truncate">
            {item.file.name}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-2">
          {getStatusText()}
        </p>

        {/* Progress Bar */}
        {(item.status === 'uploading' || item.status === 'optimizing') && (
          <Progress value={item.progress} className="h-1" />
        )}
      </div>

      {/* Remove Button */}
      {(item.status === 'error' || item.status === 'complete') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
