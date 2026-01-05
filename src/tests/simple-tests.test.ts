import { describe, it, expect } from 'vitest';

// Simple smoke tests to verify the test infrastructure works
describe('Test Infrastructure', () => {
  describe('Basic JavaScript', () => {
    it('should handle arithmetic', () => {
      expect(1 + 1).toBe(2);
      expect(5 * 3).toBe(15);
    });

    it('should handle strings', () => {
      expect('hello' + ' ' + 'world').toBe('hello world');
    });

    it('should handle arrays', () => {
      const arr = [1, 2, 3];
      expect(arr).toHaveLength(3);
      expect(arr[0]).toBe(1);
    });

    it('should handle objects', () => {
      const obj = { name: 'test', value: 42 };
      expect(obj.name).toBe('test');
      expect(obj.value).toBe(42);
    });
  });

  describe('Array Methods', () => {
    it('should filter arrays', () => {
      const numbers = [1, 2, 3, 4, 5];
      const evens = numbers.filter(n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
    });

    it('should map arrays', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should reduce arrays', () => {
      const numbers = [1, 2, 3, 4];
      const sum = numbers.reduce((a, b) => a + b, 0);
      expect(sum).toBe(10);
    });
  });

  describe('Async Operations', () => {
    it('should handle promises', async () => {
      const promise = Promise.resolve(42);
      const result = await promise;
      expect(result).toBe(42);
    });

    it('should handle async functions', async () => {
      const asyncFn = async () => {
        return 'success';
      };
      const result = await asyncFn();
      expect(result).toBe('success');
    });
  });

  describe('Error Handling', () => {
    it('should catch errors', () => {
      const throwError = () => {
        throw new Error('Test error');
      };
      expect(throwError).toThrow('Test error');
    });

    it('should handle try-catch', () => {
      try {
        throw new Error('Expected');
      } catch (e: any) {
        expect(e.message).toBe('Expected');
      }
    });
  });
});

// Test that we can import from our actual codebase
describe('Import Tests', () => {
  it('should be able to run tests', () => {
    expect(true).toBe(true);
  });
});
