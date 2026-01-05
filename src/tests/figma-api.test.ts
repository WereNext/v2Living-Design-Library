/**
 * FigmaAPI Unit Tests
 */

import { FigmaAPI, FigmaAPIKeyManager } from '../lib/figma-api';

describe('FigmaAPI', () => {
  describe('URL parsing', () => {
    test('should extract file key from standard URL', () => {
      const url = 'https://www.figma.com/file/abc123/MyDesign';
      const fileKey = FigmaAPI.extractFileKey(url);
      expect(fileKey).toBe('abc123');
    });

    test('should extract file key from design URL', () => {
      const url = 'https://www.figma.com/design/xyz789/MyDesign';
      const fileKey = FigmaAPI.extractFileKey(url);
      expect(fileKey).toBe('xyz789');
    });

    test('should extract file key from raw key', () => {
      const fileKey = FigmaAPI.extractFileKey('abc123');
      expect(fileKey).toBe('abc123');
    });

    test('should return null for invalid URL', () => {
      const fileKey = FigmaAPI.extractFileKey('https://example.com');
      expect(fileKey).toBeNull();
    });

    test('should extract node ID from URL', () => {
      const url = 'https://figma.com/file/abc?node-id=123:456';
      const nodeId = FigmaAPI.extractNodeId(url);
      expect(nodeId).toBe('123:456');
    });

    test('should extract node ID with encoded separator', () => {
      const url = 'https://figma.com/file/abc?node-id=123%3A456';
      const nodeId = FigmaAPI.extractNodeId(url);
      expect(nodeId).toBe('123:456');
    });

    test('should extract node ID from raw ID', () => {
      const nodeId = FigmaAPI.extractNodeId('123:456');
      expect(nodeId).toBe('123:456');
    });

    test('should parse complete URL', () => {
      const url = 'https://figma.com/file/abc123?node-id=123:456';
      const parsed = FigmaAPI.parseUrl(url);
      expect(parsed).toEqual({
        fileKey: 'abc123',
        nodeId: '123:456',
      });
    });

    test('should parse URL without node ID', () => {
      const url = 'https://figma.com/file/abc123/MyDesign';
      const parsed = FigmaAPI.parseUrl(url);
      expect(parsed).toEqual({
        fileKey: 'abc123',
        nodeId: undefined,
      });
    });
  });

  describe('API key validation', () => {
    test('should validate correct API key format', () => {
      const validKey = 'figd_' + 'x'.repeat(40);
      expect(FigmaAPI.isValidApiKey(validKey)).toBe(true);
    });

    test('should reject short API key', () => {
      const shortKey = 'figd_short';
      expect(FigmaAPI.isValidApiKey(shortKey)).toBe(false);
    });

    test('should reject key without prefix', () => {
      const noPrefixKey = 'x'.repeat(50);
      expect(FigmaAPI.isValidApiKey(noPrefixKey)).toBe(false);
    });

    test('should reject empty key', () => {
      expect(FigmaAPI.isValidApiKey('')).toBe(false);
    });
  });
});

describe('FigmaAPIKeyManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save API key', () => {
    const apiKey = 'figd_test_key_12345';
    FigmaAPIKeyManager.save(apiKey);
    expect(localStorage.getItem('figma_api_key')).toBe(apiKey);
  });

  test('should load API key', () => {
    const apiKey = 'figd_test_key_12345';
    localStorage.setItem('figma_api_key', apiKey);
    expect(FigmaAPIKeyManager.load()).toBe(apiKey);
  });

  test('should return null when no key saved', () => {
    expect(FigmaAPIKeyManager.load()).toBeNull();
  });

  test('should remove API key', () => {
    const apiKey = 'figd_test_key_12345';
    localStorage.setItem('figma_api_key', apiKey);
    FigmaAPIKeyManager.remove();
    expect(localStorage.getItem('figma_api_key')).toBeNull();
  });

  test('should check if key exists', () => {
    expect(FigmaAPIKeyManager.hasKey()).toBe(false);
    localStorage.setItem('figma_api_key', 'figd_test');
    expect(FigmaAPIKeyManager.hasKey()).toBe(true);
  });
});
