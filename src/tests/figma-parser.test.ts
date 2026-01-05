/**
 * FigmaNodeParser Unit Tests
 */

import { FigmaNodeParser } from '../lib/figma-parser';
import type { FigmaNode } from '../types/imported-component';

describe('FigmaNodeParser', () => {
  let parser: FigmaNodeParser;

  beforeEach(() => {
    parser = new FigmaNodeParser();
  });

  describe('Node type mapping', () => {
    test('should map FRAME to frame', () => {
      const figmaNode: FigmaNode = {
        id: '1',
        name: 'Test Frame',
        type: 'FRAME',
      };
      const result = parser.parse(figmaNode);
      expect(result.type).toBe('frame');
    });

    test('should map TEXT to text', () => {
      const figmaNode: FigmaNode = {
        id: '2',
        name: 'Test Text',
        type: 'TEXT',
        characters: 'Hello World',
      };
      const result = parser.parse(figmaNode);
      expect(result.type).toBe('text');
      expect(result.props.text).toBe('Hello World');
    });

    test('should detect button from name', () => {
      const figmaNode: FigmaNode = {
        id: '3',
        name: 'Primary Button',
        type: 'FRAME',
      };
      const result = parser.parse(figmaNode);
      expect(result.type).toBe('button');
    });

    test('should detect input from name', () => {
      const figmaNode: FigmaNode = {
        id: '4',
        name: 'Email Input',
        type: 'FRAME',
      };
      const result = parser.parse(figmaNode);
      expect(result.type).toBe('input');
    });
  });

  describe('Layout parsing', () => {
    test('should parse horizontal auto layout', () => {
      const figmaNode: FigmaNode = {
        id: '5',
        name: 'Horizontal Container',
        type: 'FRAME',
        layoutMode: 'HORIZONTAL',
        itemSpacing: 16,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.layout?.display).toBe('flex');
      expect(result.styles.layout?.flexDirection).toBe('row');
      expect(result.styles.layout?.gap).toBe('16px');
      expect(result.styles.layout?.justifyContent).toBe('center');
      expect(result.styles.layout?.alignItems).toBe('center');
    });

    test('should parse vertical auto layout', () => {
      const figmaNode: FigmaNode = {
        id: '6',
        name: 'Vertical Container',
        type: 'FRAME',
        layoutMode: 'VERTICAL',
        itemSpacing: 8,
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MAX',
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.layout?.display).toBe('flex');
      expect(result.styles.layout?.flexDirection).toBe('column');
      expect(result.styles.layout?.gap).toBe('8px');
      expect(result.styles.layout?.justifyContent).toBe('flex-start');
      expect(result.styles.layout?.alignItems).toBe('flex-end');
    });

    test('should parse spacing between items', () => {
      const figmaNode: FigmaNode = {
        id: '7',
        name: 'Container',
        type: 'FRAME',
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'SPACE_BETWEEN',
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.layout?.justifyContent).toBe('space-between');
    });
  });

  describe('Appearance parsing', () => {
    test('should parse solid fill', () => {
      const figmaNode: FigmaNode = {
        id: '8',
        name: 'Box',
        type: 'RECTANGLE',
        fills: [{
          type: 'SOLID',
          color: { r: 1, g: 0, b: 0, a: 1 },
          opacity: 1,
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.appearance?.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    test('should parse solid fill with opacity', () => {
      const figmaNode: FigmaNode = {
        id: '9',
        name: 'Box',
        type: 'RECTANGLE',
        fills: [{
          type: 'SOLID',
          color: { r: 0, g: 1, b: 0, a: 1 },
          opacity: 0.5,
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.appearance?.backgroundColor).toBe('rgba(0, 255, 0, 0.5)');
    });

    test('should parse border radius', () => {
      const figmaNode: FigmaNode = {
        id: '10',
        name: 'Rounded Box',
        type: 'RECTANGLE',
        cornerRadius: 8,
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.appearance?.borderRadius).toBe('8px');
    });

    test('should parse stroke', () => {
      const figmaNode: FigmaNode = {
        id: '11',
        name: 'Bordered Box',
        type: 'RECTANGLE',
        strokes: [{
          type: 'SOLID',
          color: { r: 0, g: 0, b: 0, a: 1 },
        }],
        strokeWeight: 2,
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.appearance?.border).toBe('2px solid rgb(0, 0, 0)');
    });
  });

  describe('Typography parsing', () => {
    test('should parse text styles', () => {
      const figmaNode: FigmaNode = {
        id: '12',
        name: 'Heading',
        type: 'TEXT',
        characters: 'Hello',
        style: {
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 24,
          lineHeightPx: 32,
          letterSpacing: -0.5,
          textAlignHorizontal: 'CENTER',
        },
        fills: [{
          type: 'SOLID',
          color: { r: 0, g: 0, b: 0, a: 1 },
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.typography?.fontFamily).toBe('Inter');
      expect(result.styles.typography?.fontWeight).toBe(700);
      expect(result.styles.typography?.fontSize).toBe('24px');
      expect(result.styles.typography?.lineHeight).toBe('32px');
      expect(result.styles.typography?.letterSpacing).toBe('-0.5px');
      expect(result.styles.typography?.textAlign).toBe('center');
      expect(result.styles.typography?.color).toBe('rgb(0, 0, 0)');
    });

    test('should parse text transform', () => {
      const figmaNode: FigmaNode = {
        id: '13',
        name: 'Uppercase Text',
        type: 'TEXT',
        characters: 'text',
        style: {
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: 16,
          textAlignHorizontal: 'LEFT',
          textCase: 'UPPER',
        },
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.typography?.textTransform).toBe('uppercase');
    });
  });

  describe('Effects parsing', () => {
    test('should parse drop shadow', () => {
      const figmaNode: FigmaNode = {
        id: '14',
        name: 'Shadow Box',
        type: 'RECTANGLE',
        effects: [{
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: 4 },
          radius: 8,
          spread: 0,
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.effects?.boxShadow).toContain('0px 4px 8px');
      expect(result.styles.effects?.boxShadow).toContain('rgba(0, 0, 0, 0.1)');
    });

    test('should parse multiple shadows', () => {
      const figmaNode: FigmaNode = {
        id: '15',
        name: 'Multi Shadow',
        type: 'RECTANGLE',
        effects: [
          {
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: 2 },
            radius: 4,
          },
          {
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.05 },
            offset: { x: 0, y: 4 },
            radius: 8,
          },
        ],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.effects?.boxShadow).toContain(',');
    });
  });

  describe('Spacing parsing', () => {
    test('should parse uniform padding', () => {
      const figmaNode: FigmaNode = {
        id: '16',
        name: 'Padded Box',
        type: 'FRAME',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.spacing?.padding).toBe('16px');
    });

    test('should parse non-uniform padding', () => {
      const figmaNode: FigmaNode = {
        id: '17',
        name: 'Padded Box',
        type: 'FRAME',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.spacing?.padding).toBe('10px 20px 10px 20px');
    });
  });

  describe('Hierarchy parsing', () => {
    test('should parse nested children', () => {
      const figmaNode: FigmaNode = {
        id: '18',
        name: 'Parent',
        type: 'FRAME',
        children: [
          {
            id: '19',
            name: 'Child 1',
            type: 'TEXT',
            characters: 'Text 1',
          },
          {
            id: '20',
            name: 'Child 2',
            type: 'TEXT',
            characters: 'Text 2',
          },
        ],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.children).toHaveLength(2);
      expect(result.children?.[0].id).toBe('19');
      expect(result.children?.[0].props.text).toBe('Text 1');
      expect(result.children?.[1].id).toBe('20');
      expect(result.children?.[1].props.text).toBe('Text 2');
    });

    test('should parse deeply nested structure', () => {
      const figmaNode: FigmaNode = {
        id: '21',
        name: 'Root',
        type: 'FRAME',
        children: [{
          id: '22',
          name: 'Level 1',
          type: 'FRAME',
          children: [{
            id: '23',
            name: 'Level 2',
            type: 'FRAME',
            children: [{
              id: '24',
              name: 'Level 3',
              type: 'TEXT',
              characters: 'Deep text',
            }],
          }],
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.children?.[0].children?.[0].children?.[0].props.text).toBe('Deep text');
    });
  });

  describe('Image parsing', () => {
    test('should extract image reference', () => {
      const figmaNode: FigmaNode = {
        id: '25',
        name: 'Image',
        type: 'RECTANGLE',
        fills: [{
          type: 'IMAGE',
          imageRef: 'image-ref-123',
          scaleMode: 'FILL',
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.props.imageSrc).toBe('image-ref-123');
    });

    test('should map image scale modes', () => {
      const figmaNode: FigmaNode = {
        id: '26',
        name: 'Image',
        type: 'RECTANGLE',
        fills: [{
          type: 'IMAGE',
          imageRef: 'img-ref',
          scaleMode: 'FIT',
        }],
      };
      const result = parser.parse(figmaNode);
      
      expect(result.styles.appearance?.backgroundSize).toBe('contain');
    });
  });

  describe('Visibility', () => {
    test('should mark visible nodes', () => {
      const figmaNode: FigmaNode = {
        id: '27',
        name: 'Visible',
        type: 'FRAME',
        visible: true,
      };
      const result = parser.parse(figmaNode);
      
      expect(result.isVisible).toBe(true);
    });

    test('should mark hidden nodes', () => {
      const figmaNode: FigmaNode = {
        id: '28',
        name: 'Hidden',
        type: 'FRAME',
        visible: false,
      };
      const result = parser.parse(figmaNode);
      
      expect(result.isVisible).toBe(false);
    });
  });
});
