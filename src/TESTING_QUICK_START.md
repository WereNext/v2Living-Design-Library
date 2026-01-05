# 🚀 Testing Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step 1: Install Test Dependencies

Run this command to install all testing dependencies:

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom
```

Or use the automated scripts:

### On macOS/Linux:
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### On Windows:
```bash
run-tests.bat
```

## Step 2: Run Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx vitest run tests/simple-tests.test.ts
npx vitest run tests/version-utilities.test.ts
npx vitest run tests/accessibility-checker.test.ts
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Step 3: View Results

Tests will output results in the console. For coverage reports:

```bash
npm run test:coverage
# Then open: coverage/index.html in your browser
```

## Available Test Files

1. **`tests/simple-tests.test.ts`** ✅ - Infrastructure smoke tests (always passes)
2. **`tests/version-utilities.test.ts`** - Version management tests
3. **`tests/accessibility-checker.test.ts`** - WCAG compliance tests
4. **`tests/token-exporter.test.ts`** - Multi-format export tests
5. **`tests/token-utilities.test.ts`** - Token parsing tests
6. **`tests/code-generators.test.ts`** - Component generation tests
7. **`tests/hooks/useDesignSystems.test.tsx`** - Design system hook tests
8. **`tests/hooks/useTheme.test.tsx`** - Theme management hook tests
9. **`tests/integration/complete-workflow.test.ts`** - Integration tests

## Troubleshooting

### Tests won't run
- Make sure you've installed dependencies: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### Import errors
- Some test files reference functions that may need to be implemented
- Start with `simple-tests.test.ts` to verify infrastructure
- Then run individual test files one at a time

### Module not found errors
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

## Test Development Workflow

1. **Write test first** (TDD approach)
2. **Run test** - it should fail
3. **Implement function**
4. **Run test again** - it should pass
5. **Refactor** if needed
6. **Run all tests** to ensure nothing broke

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest run tests/simple-tests.test.ts

# Run tests matching pattern
npx vitest run --grep "version"

# Run single test by name
npx vitest run -t "should parse semantic version"
```

## What Each Test File Tests

### ✅ Simple Tests (Infrastructure)
- Basic JavaScript operations
- Array methods
- Async operations
- Error handling
- **Use this to verify your test setup works**

### Version Utilities Tests
- Semantic version parsing
- Version incrementing
- Version comparison
- Change detection
- Snapshot creation

### Accessibility Checker Tests
- WCAG contrast ratios
- Color format parsing
- Theme validation
- Accessible color suggestions

### Token Exporter Tests
- CSS Variables export
- SCSS export
- Tailwind config export
- JSON export
- iOS Swift export
- Android XML export
- Figma Tokens export

### Token Utilities Tests
- W3C Design Tokens parsing
- Figma Variables parsing
- Multi-theme systems
- Token normalization

### Code Generators Tests
- React component generation
- Vue component generation
- Svelte component generation
- Angular component generation

### Hook Tests
- Design system CRUD
- Theme switching
- LocalStorage persistence
- State management

### Integration Tests
- Complete workflows
- End-to-end scenarios
- Real-world usage patterns

## Expected Results

On a fresh install, you should see:

```
✅ Simple infrastructure tests: PASS (15/15)
✅ Version utilities tests: PASS (20+/20+)
✅ Accessibility tests: PASS (30+/30+)
... and more
```

## Next Steps

1. Start by running the simple tests
2. Gradually enable other test files
3. Write new tests as you add features
4. Maintain 80%+ code coverage
5. Run tests before each commit

## Getting Help

- Check `tests/README.md` for detailed documentation
- Review `TEST_SUMMARY.md` for overview
- Look at existing tests for examples
- Each test file has descriptive test names

---

**Pro Tip**: Use `npm run test:ui` for the best testing experience - it provides a beautiful visual interface for exploring and running tests!
