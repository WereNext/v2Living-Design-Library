/**
 * Imported Component Types
 * 
 * Type definitions for components imported from Figma,
 * including structure, images, and metadata
 */

export interface ImportedComponent {
  id: string;
  name: string;
  description?: string;
  
  // Source tracking
  source: {
    type: 'figma' | 'manual' | 'template';
    fileKey?: string;
    nodeId?: string;
    figmaLink?: string;
  };
  
  // Classification
  category: ComponentCategory;
  designIntent?: string;
  tags?: string[];
  
  // Structure
  structure: ComponentNode;
  
  // Assets
  images: ImportedImage[];
  
  // Generated code
  code: {
    jsx: string;
    css?: string;
    imports: string[];
  };
  
  // Tokens (can override system tokens)
  localTokens?: {
    colors?: Record<string, string>;
    spacing?: Record<string, string>;
    typography?: Record<string, string>;
  };
  
  // Metadata
  metadata: {
    importedAt: string;
    lastEdited?: string;
    version: string;
    thumbnail?: string;
    author?: string;
  };
  
  // State
  isEditable: boolean;
  isDraft?: boolean;
}

export type ComponentCategory = 
  | 'hero'
  | 'card'
  | 'button'
  | 'form'
  | 'navigation'
  | 'layout'
  | 'feature'
  | 'testimonial'
  | 'pricing'
  | 'cta'
  | 'footer'
  | 'header'
  | 'product'
  | 'article'
  | 'custom';

export interface ComponentNode {
  id: string;
  name: string;
  type: NodeType;
  
  // Content
  props: NodeProps;
  
  // Styling
  styles: NodeStyles;
  
  // Hierarchy
  children?: ComponentNode[];
  
  // State
  isEditable?: boolean;
  isVisible?: boolean;
}

export type NodeType = 
  | 'frame'      // Container with layout
  | 'text'       // Text content
  | 'image'      // Image element
  | 'rectangle'  // Shape/box
  | 'group'      // Logical grouping
  | 'component'  // Nested component
  | 'button'     // Interactive button
  | 'input';     // Form input

export interface NodeProps {
  // Text content
  text?: string;
  placeholder?: string;
  
  // Image
  imageSrc?: string;
  imageAlt?: string;
  
  // Dimensions
  width?: number | 'auto' | 'fill';
  height?: number | 'auto' | 'fill';
  
  // Interactive
  href?: string;
  onClick?: string;
  
  // Form
  inputType?: 'text' | 'email' | 'password' | 'number';
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
}

export interface NodeStyles {
  layout?: LayoutStyles;
  appearance?: AppearanceStyles;
  typography?: TypographyStyles;
  spacing?: SpacingStyles;
  effects?: EffectStyles;
}

export interface LayoutStyles {
  // Display
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'none';
  
  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  gap?: string;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  
  // Positioning
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  
  // Sizing
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

export interface AppearanceStyles {
  // Background
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  
  // Border
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  
  // Opacity
  opacity?: number;
  
  // Cursor
  cursor?: string;
}

export interface TypographyStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  color?: string;
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
}

export interface SpacingStyles {
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

export interface EffectStyles {
  boxShadow?: string;
  filter?: string;
  transform?: string;
  transition?: string;
  animation?: string;
}

export interface ImportedImage {
  id: string;
  name: string;
  
  // Source
  figmaUrl?: string;
  
  // Storage
  localPath?: string; // base64 or IndexedDB key
  format: 'png' | 'jpg' | 'jpeg' | 'svg' | 'webp' | 'gif';
  
  // Metadata
  width: number;
  height: number;
  size?: number; // bytes
  
  // Usage tracking
  usedInNodes: string[]; // Node IDs using this image
  
  // Optimization
  optimized?: boolean;
  thumbnail?: string;
}

// Figma API Types
export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  
  // Layout
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  
  // Positioning
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  
  // Constraints
  constraints?: {
    horizontal: 'MIN' | 'MAX' | 'CENTER' | 'STRETCH' | 'SCALE';
    vertical: 'MIN' | 'MAX' | 'CENTER' | 'STRETCH' | 'SCALE';
  };
  
  // Appearance
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  cornerRadius?: number;
  
  // Effects
  effects?: FigmaEffect[];
  
  // Text
  characters?: string;
  style?: FigmaTextStyle;
  
  // Image
  imageRef?: string;
  
  // Hierarchy
  children?: FigmaNode[];
  
  // Blend
  opacity?: number;
  blendMode?: string;
  
  // Clipping
  clipsContent?: boolean;
}

export interface FigmaPaint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE';
  visible?: boolean;
  opacity?: number;
  color?: FigmaColor;
  gradientStops?: FigmaGradientStop[];
  imageRef?: string;
  scaleMode?: 'FILL' | 'FIT' | 'TILE' | 'STRETCH';
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaGradientStop {
  color: FigmaColor;
  position: number;
}

export interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible?: boolean;
  radius?: number;
  color?: FigmaColor;
  offset?: { x: number; y: number };
  spread?: number;
}

export interface FigmaTextStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  fontWeight: number;
  fontSize: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
  letterSpacing?: number;
  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
}

// Component Registry Types
export interface ComponentFilter {
  category?: ComponentCategory;
  designIntent?: string;
  tags?: string[];
  searchTerm?: string;
}

export interface ComponentUpdate {
  structure?: ComponentNode;
  code?: Partial<ImportedComponent['code']>;
  images?: ImportedImage[];
  metadata?: Partial<ImportedComponent['metadata']>;
}
