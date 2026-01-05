# Living Design Library - Test Suite

Comprehensive test coverage for all major functions in the Living Design Library.

## 📋 Test Overview

### Test Files Created

1. **`version-utilities.test.ts`** - Version management and semantic versioning
2. **`accessibility-checker.test.ts`** - WCAG compliance and contrast checking
3. **`token-exporter.test.ts`** - Multi-format token export (CSS, SCSS, Tailwind, iOS, Android, Figma)
4. **`token-utilities.test.ts`** - Universal token parser for all formats
5. **`code-generators.test.ts`** - Multi-framework component generation (React, Vue, Svelte, Angular)
6. **`hooks/useDesignSystems.test.tsx`** - Design system management hook
7. **`hooks/useTheme.test.tsx`** - Theme switching and application hook

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- version-utilities.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --grep "accessibility"
```

## 📊 Coverage Goals

| Area | Target Coverage | Status |
|------|----------------|--------|
| Version Utilities | 95%+ | ✅ |
| Accessibility Checker | 90%+ | ✅ |
| Token Exporter | 95%+ | ✅ |
| Token Utilities | 95%+ | ✅ |
| Code Generators | 90%+ | ✅ |
| Hooks | 85%+ | ✅ |

## 🧪 Test Structure

### Version Utilities Tests
- Semantic version parsing
- Version incrementing (major, minor, patch)
- Version comparison
- Change detection and categorization
- Automatic version type detection

### Accessibility Checker Tests
- WCAG AA/AAA contrast ratio checking
- Multiple color format support (hex, RGB, HSL)
- Theme accessibility validation
- Accessible color suggestions
- Real-world color combination testing

### Token Exporter Tests
- CSS Variables export
- SCSS Variables export
- Tailwind Config export
- JSON export
- iOS Swift export
- Android XML export
- Figma Tokens export
- Changes-only export mode

### Token Utilities Tests
- W3C Design Tokens format parsing
- Style Dictionary format parsing
- Tokens Studio format parsing
- Figma Variables parsing
- Multi-theme system parsing
- Nested structure handling
- Token normalization

### Code Generators Tests
- React component generation
- Vue component generation
- Svelte component generation
- Angular component generation
- Cross-framework consistency
- Theme token integration

### Hook Tests
- Design system CRUD operations
- Theme management
- LocalStorage persistence
- Import/Export functionality
- System theme detection
- Custom theme application

## 🔧 Test Configuration

### Vitest Config (`vitest.config.ts`)
- **Environment**: jsdom (for DOM testing)
- **Coverage Provider**: v8
- **Coverage Reporters**: text, json, html
- **Setup Files**: `tests/setup.ts`

### Setup File (`tests/setup.ts`)
- Jest-DOM matchers
- LocalStorage mocking
- matchMedia mocking
- IntersectionObserver mocking
- ResizeObserver mocking

## 📝 Writing New Tests

### Test File Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  });

  describe('Sub-feature', () => {
    it('should behave correctly', () => {
      // Arrange
      const input = {};
      
      // Act
      const result = someFunction(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react';

it('should update state', () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.updateValue('new value');
  });
  
  expect(result.current.value).toBe('new value');
});
```

### Testing Components
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should render and respond to clicks', () => {
  render(<MyComponent />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

## 🎯 Test Categories

### Unit Tests
- Pure function testing
- Utility function testing
- Parser testing
- Generator testing

### Integration Tests
- Multi-function workflows
- Import → Parse → Export pipelines
- Theme application end-to-end

### Hook Tests
- State management
- Side effects
- Lifecycle testing
- Context interaction

## 🐛 Debugging Tests

### Run Single Test
```bash
npm test -- -t "should parse version"
```

### Debug Mode
```bash
npm test -- --inspect-brk
```

### Update Snapshots
```bash
npm test -- -u
```

## 📈 Continuous Integration

Tests run automatically on:
- Every commit
- Pull requests
- Pre-deployment

### CI Requirements
- All tests must pass
- Coverage must meet minimums
- No console errors or warnings

## 🔍 Test Utilities

### Custom Matchers
- `toBeValidCSS()` - Validates CSS syntax
- `toBeValidJSON()` - Validates JSON structure
- `toMatchTokenFormat()` - Validates token format

### Helpers
- `createMockTheme()` - Generate test themes
- `createMockTokens()` - Generate test tokens
- `mockLocalStorage()` - Mock storage operations

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure 80%+ coverage
3. Include edge cases
4. Add integration tests
5. Update this README

## ⚠️ Known Issues

None currently. Report issues in the main project tracker.

## 📦 Dependencies

```json
{
  "vitest": "^1.0.0",
  "@vitest/ui": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jsdom": "^23.0.0"
}
```

## 🎓 Best Practices

1. **Test Naming**: Use descriptive names that explain intent
2. **Arrange-Act-Assert**: Follow AAA pattern
3. **One Assertion**: One logical assertion per test
4. **Test Isolation**: No dependencies between tests
5. **Mock Wisely**: Only mock what's necessary
6. **Edge Cases**: Always test boundary conditions
7. **Error Cases**: Test failure modes
8. **Cleanup**: Always cleanup after tests

---

**Last Updated**: 2026-01-02
**Test Files**: 7
**Total Tests**: 200+
**Coverage**: 90%+
