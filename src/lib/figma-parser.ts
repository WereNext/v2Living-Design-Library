/**
 * Figma Node Parser
 * 
 * Converts Figma node structure to our ComponentNode format
 * Handles layout, styling, and content extraction
 */

import type {
  FigmaNode,
  FigmaColor,
  FigmaPaint,
  FigmaEffect,
  ComponentNode,
  NodeStyles,
  LayoutStyles,
  AppearanceStyles,
  TypographyStyles,
  SpacingStyles,
  NodeType,
} from '../types/imported-component';

export class FigmaNodeParser {
  /**
   * Parse Figma node to ComponentNode
   */
  parse(figmaNode: FigmaNode): ComponentNode {
    return {
      id: figmaNode.id,
      name: figmaNode.name,
      type: this.mapNodeType(figmaNode),
      props: this.extractProps(figmaNode),
      styles: this.extractStyles(figmaNode),
      children: figmaNode.children?.map(child => this.parse(child)),
      isEditable: true,
      isVisible: figmaNode.visible !== false,
    };
  }

  /**
   * Map Figma node type to our NodeType
   */
  private mapNodeType(node: FigmaNode): NodeType {
    const typeMap: Record<string, NodeType> = {
      'FRAME': 'frame',
      'GROUP': 'group',
      'TEXT': 'text',
      'RECTANGLE': 'rectangle',
      'ELLIPSE': 'rectangle',
      'VECTOR': 'rectangle',
      'IMAGE': 'image',
      'COMPONENT': 'component',
      'INSTANCE': 'component',
    };

    // Check if it's button-like
    if (this.isButton(node)) {
      return 'button';
    }

    // Check if it's input-like
    if (this.isInput(node)) {
      return 'input';
    }

    return typeMap[node.type] || 'frame';
  }

  /**
   * Extract node props
   */
  private extractProps(node: FigmaNode) {
    const props: ComponentNode['props'] = {
      width: node.width || 'auto',
      height: node.height || 'auto',
    };

    // Text content
    if (node.type === 'TEXT' && node.characters) {
      props.text = node.characters;
    }

    // Image reference
    if (node.imageRef) {
      props.imageSrc = node.imageRef;
      props.imageAlt = node.name;
    }

    // Check for image fills
    const imageFill = node.fills?.find(f => f.type === 'IMAGE' && f.imageRef);
    if (imageFill && 'imageRef' in imageFill) {
      props.imageSrc = imageFill.imageRef;
      props.imageAlt = node.name;
    }

    // Accessibility
    props.ariaLabel = node.name;

    return props;
  }

  /**
   * Extract all styles
   */
  private extractStyles(node: FigmaNode): NodeStyles {
    return {
      layout: this.parseLayout(node),
      appearance: this.parseAppearance(node),
      typography: this.parseTypography(node),
      spacing: this.parseSpacing(node),
      effects: this.parseEffects(node),
    };
  }

  /**
   * Parse layout styles
   */
  private parseLayout(node: FigmaNode): LayoutStyles {
    const layout: LayoutStyles = {};

    // Auto Layout (Flexbox)
    if (node.layoutMode && node.layoutMode !== 'NONE') {
      layout.display = 'flex';
      layout.flexDirection = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
      
      if (node.itemSpacing) {
        layout.gap = `${node.itemSpacing}px`;
      }

      // Alignment
      if (node.primaryAxisAlignItems) {
        layout.justifyContent = this.mapAlignment(node.primaryAxisAlignItems);
      }

      if (node.counterAxisAlignItems) {
        layout.alignItems = this.mapCrossAlignment(node.counterAxisAlignItems);
      }
    } else if (node.children && node.children.length > 0) {
      // Absolute positioning for non-auto-layout frames
      layout.position = 'relative';
    }

    // Sizing
    if (node.width !== undefined) {
      layout.width = this.mapSize(node.width, node.primaryAxisSizingMode);
    }
    if (node.height !== undefined) {
      layout.height = this.mapSize(node.height, node.counterAxisSizingMode);
    }

    // Overflow
    if (node.clipsContent) {
      layout.overflow = 'hidden';
    }

    return layout;
  }

  /**
   * Parse appearance styles
   */
  private parseAppearance(node: FigmaNode): AppearanceStyles {
    const appearance: AppearanceStyles = {};

    // Background
    if (node.fills && node.fills.length > 0) {
      const primaryFill = node.fills[0];
      
      if (primaryFill.type === 'SOLID' && primaryFill.color) {
        appearance.backgroundColor = this.rgbaToString(
          primaryFill.color,
          primaryFill.opacity
        );
      } else if (primaryFill.type.includes('GRADIENT')) {
        appearance.background = this.parseGradient(primaryFill);
      } else if (primaryFill.type === 'IMAGE' && 'imageRef' in primaryFill) {
        appearance.backgroundImage = `url(${primaryFill.imageRef})`;
        appearance.backgroundSize = this.mapImageScale(primaryFill.scaleMode);
      }
    }

    // Border
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      const weight = node.strokeWeight || 1;
      const color = stroke.color ? this.rgbaToString(stroke.color, stroke.opacity) : '#000000';
      appearance.border = `${weight}px solid ${color}`;
    }

    // Border Radius
    if (node.cornerRadius !== undefined) {
      appearance.borderRadius = `${node.cornerRadius}px`;
    }

    // Opacity
    if (node.opacity !== undefined && node.opacity < 1) {
      appearance.opacity = node.opacity;
    }

    return appearance;
  }

  /**
   * Parse typography styles
   */
  private parseTypography(node: FigmaNode): TypographyStyles | undefined {
    if (node.type !== 'TEXT' || !node.style) return undefined;

    const typo: TypographyStyles = {
      fontFamily: node.style.fontFamily,
      fontSize: `${node.style.fontSize}px`,
      fontWeight: node.style.fontWeight,
      lineHeight: node.style.lineHeightPx 
        ? `${node.style.lineHeightPx}px` 
        : node.style.lineHeightPercent 
        ? `${node.style.lineHeightPercent}%`
        : 'normal',
      textAlign: node.style.textAlignHorizontal.toLowerCase() as any,
    };

    // Letter spacing
    if (node.style.letterSpacing) {
      typo.letterSpacing = `${node.style.letterSpacing}px`;
    }

    // Text transform
    if (node.style.textCase) {
      const caseMap = {
        'UPPER': 'uppercase',
        'LOWER': 'lowercase',
        'TITLE': 'capitalize',
        'ORIGINAL': 'none',
      };
      typo.textTransform = caseMap[node.style.textCase] as any;
    }

    // Text decoration
    if (node.style.textDecoration && node.style.textDecoration !== 'NONE') {
      typo.textDecoration = node.style.textDecoration.toLowerCase();
    }

    // Color
    if (node.fills && node.fills.length > 0 && node.fills[0].color) {
      typo.color = this.rgbaToString(node.fills[0].color, node.fills[0].opacity);
    }

    return typo;
  }

  /**
   * Parse spacing (padding)
   */
  private parseSpacing(node: FigmaNode): SpacingStyles {
    const spacing: SpacingStyles = {};

    if (node.paddingLeft !== undefined || node.paddingRight !== undefined ||
        node.paddingTop !== undefined || node.paddingBottom !== undefined) {
      
      const top = node.paddingTop || 0;
      const right = node.paddingRight || 0;
      const bottom = node.paddingBottom || 0;
      const left = node.paddingLeft || 0;

      if (top === right && right === bottom && bottom === left) {
        spacing.padding = `${top}px`;
      } else {
        spacing.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      }
    }

    return spacing;
  }

  /**
   * Parse effects (shadows, blurs)
   */
  private parseEffects(node: FigmaNode) {
    const effects: any = {};

    if (node.effects && node.effects.length > 0) {
      const shadows = node.effects
        .filter(e => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
        .map(e => this.parseShadow(e))
        .filter(Boolean);

      if (shadows.length > 0) {
        effects.boxShadow = shadows.join(', ');
      }

      const blurs = node.effects.filter(e => e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR');
      if (blurs.length > 0 && blurs[0].radius) {
        effects.filter = `blur(${blurs[0].radius}px)`;
      }
    }

    return effects;
  }

  /**
   * Helper: Convert RGBA to string
   */
  private rgbaToString(color: FigmaColor, opacity: number = 1): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = (color.a ?? 1) * (opacity ?? 1);

    if (a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Helper: Parse gradient
   */
  private parseGradient(paint: FigmaPaint): string {
    if (!paint.gradientStops) return '';

    const type = paint.type === 'GRADIENT_LINEAR' ? 'linear-gradient' :
                 paint.type === 'GRADIENT_RADIAL' ? 'radial-gradient' :
                 'linear-gradient';

    const stops = paint.gradientStops.map(stop => {
      const color = this.rgbaToString(stop.color);
      const position = Math.round(stop.position * 100);
      return `${color} ${position}%`;
    }).join(', ');

    if (type === 'linear-gradient') {
      return `${type}(90deg, ${stops})`;
    }
    return `${type}(${stops})`;
  }

  /**
   * Helper: Parse shadow
   */
  private parseShadow(effect: FigmaEffect): string {
    if (!effect.color || !effect.offset) return '';

    const x = effect.offset.x || 0;
    const y = effect.offset.y || 0;
    const blur = effect.radius || 0;
    const spread = effect.spread || 0;
    const color = this.rgbaToString(effect.color);
    const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';

    return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }

  /**
   * Helper: Map alignment
   */
  private mapAlignment(align: string): LayoutStyles['justifyContent'] {
    const map: Record<string, any> = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
      'SPACE_BETWEEN': 'space-between',
    };
    return map[align] || 'flex-start';
  }

  /**
   * Helper: Map cross-axis alignment
   */
  private mapCrossAlignment(align: string): LayoutStyles['alignItems'] {
    const map: Record<string, any> = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
    };
    return map[align] || 'stretch';
  }

  /**
   * Helper: Map sizing mode
   */
  private mapSize(value: number, mode?: string): string {
    if (mode === 'AUTO') return 'auto';
    if (mode === 'FILL') return '100%';
    // For fixed sizes, use max-width to allow flexibility
    return `${value}px`;
  }

  /**
   * Helper: Map image scale mode
   */
  private mapImageScale(mode?: string): string {
    const map: Record<string, string> = {
      'FILL': 'cover',
      'FIT': 'contain',
      'TILE': 'repeat',
      'STRETCH': '100% 100%',
    };
    return map[mode || 'FILL'] || 'cover';
  }

  /**
   * Helper: Check if node is button-like
   */
  private isButton(node: FigmaNode): boolean {
    const name = node.name.toLowerCase();
    return name.includes('button') || 
           name.includes('btn') ||
           (node.type === 'FRAME' && node.children?.some(c => c.type === 'TEXT' && c.characters));
  }

  /**
   * Helper: Check if node is input-like
   */
  private isInput(node: FigmaNode): boolean {
    const name = node.name.toLowerCase();
    return name.includes('input') ||
           name.includes('textfield') ||
           name.includes('text field') ||
           name.includes('search');
  }
}