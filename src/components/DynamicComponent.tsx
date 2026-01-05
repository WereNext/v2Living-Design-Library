/**
 * Dynamic Component Renderer
 * 
 * Renders imported components dynamically from ComponentNode structure
 */

import React from 'react';
import type { ComponentNode, ImportedImage, ImportedComponent } from '../types/imported-component';

interface DynamicComponentProps {
  component: ImportedComponent;
  editable?: boolean;
  onNodeClick?: (nodeId: string) => void;
}

export function DynamicComponent({ 
  component, 
  editable = false,
  onNodeClick 
}: DynamicComponentProps) {
  return (
    <div className="dynamic-component-wrapper">
      {renderNode(component.structure, component.images, editable, onNodeClick)}
    </div>
  );
}

/**
 * Render individual node
 */
function renderNode(
  node: ComponentNode,
  images: ImportedImage[],
  editable: boolean,
  onNodeClick?: (nodeId: string) => void,
  key?: string
): React.ReactNode {
  if (!node.isVisible) return null;

  const style = combineStyles(node.styles);
  const nodeKey = key || node.id;
  
  const handleClick = (e: React.MouseEvent) => {
    if (editable && onNodeClick) {
      e.stopPropagation();
      onNodeClick(node.id);
    }
  };

  const commonProps = {
    key: nodeKey,
    style,
    onClick: editable ? handleClick : undefined,
    className: editable ? 'editable-node' : undefined,
    'data-node-id': node.id,
    'data-node-type': node.type,
  };

  // Text node
  if (node.type === 'text') {
    return (
      <div {...commonProps}>
        {node.props.text || ''}
      </div>
    );
  }

  // Image node
  if (node.type === 'image') {
    const image = images.find(img => img.usedInNodes.includes(node.id));
    const src = image?.localPath || node.props.imageSrc || '';
    const alt = node.props.imageAlt || node.name;

    return (
      <img
        {...commonProps}
        src={src}
        alt={alt}
        loading="lazy"
      />
    );
  }

  // Button node
  if (node.type === 'button') {
    return (
      <button {...commonProps}>
        {node.children?.map((child, i) =>
          renderNode(child, images, editable, onNodeClick, `${nodeKey}-${i}`)
        )}
      </button>
    );
  }

  // Input node
  if (node.type === 'input') {
    return (
      <input
        {...commonProps}
        type={node.props.inputType || 'text'}
        placeholder={node.props.placeholder || node.props.text || ''}
        aria-label={node.props.ariaLabel}
      />
    );
  }

  // Container nodes (frame, group, component)
  const Tag = node.type === 'component' ? 'div' : 'div';

  return (
    <Tag {...commonProps}>
      {node.children?.map((child, i) =>
        renderNode(child, images, editable, onNodeClick, `${nodeKey}-${i}`)
      )}
    </Tag>
  );
}

/**
 * Combine all styles into single object
 */
function combineStyles(styles: ComponentNode['styles']): React.CSSProperties {
  const combined = {
    ...styles.layout,
    ...styles.appearance,
    ...styles.typography,
    ...styles.spacing,
    ...styles.effects,
  } as React.CSSProperties;

  // Make fixed pixel widths more responsive
  if (combined.width && typeof combined.width === 'string' && combined.width.endsWith('px')) {
    const pixelValue = parseInt(combined.width);
    // For widths > 400px, add max-width instead to allow responsiveness
    if (pixelValue > 400) {
      combined.maxWidth = combined.width;
      combined.width = '100%';
    }
  }

  return combined;
}

/**
 * Component Preview Card
 */
interface ComponentPreviewCardProps {
  component: ImportedComponent;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function ComponentPreviewCard({
  component,
  onEdit,
  onDelete,
  onClick,
}: ComponentPreviewCardProps) {
  return (
    <div 
      className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        <div className="absolute inset-0 scale-50 origin-top-left">
          <DynamicComponent component={component} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold mb-1">{component.name}</h3>
        {component.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {component.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="capitalize">{component.category}</span>
          {component.designIntent && (
            <>
              <span>•</span>
              <span>{component.designIntent}</span>
            </>
          )}
          {component.images.length > 0 && (
            <>
              <span>•</span>
              <span>{component.images.length} image{component.images.length !== 1 ? 's' : ''}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-3 py-1.5 text-sm border border-destructive text-destructive rounded hover:bg-destructive/10 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}