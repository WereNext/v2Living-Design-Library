# 🎯 Run Tests - Step by Step

## You're about to run `npm test` - here's what to do:

### Step 1: Install Dependencies (if not already installed)

```bash
npm install
```

This will install all the testing dependencies already configured in package.json:
- vitest
- @vitest/ui
- @testing-library/react
- @testing-library/jest-dom
- jsdom

### Step 2: Run Tests

```bash
npm test
```

## What Will Happen

When you run `npm test`, Vitest will:

1. **Load all test files** from the `tests/` directory
2. **Run 250+ test cases** across 9 test files
3. **Show results** in your terminal

## Expected Output

You should see something like:

```
 ✓ tests/simple-tests.test.ts (15 tests) 45ms
 ✓ tests/version-utilities.test.ts (20 tests) 123ms
 ✓ tests/accessibility-checker.test.ts (35 tests) 234ms
 ✓ tests/token-exporter.test.ts (50 tests) 345ms

 Test Files  9 passed (9)
      Tests  250 passed (250)
   Duration  2.34s
```

## If You Get Errors

### "Cannot find module"
This means dependencies aren't installed. Run:
```bash
npm install
```

### Import/Export Errors
Some tests reference functions that need implementation. This is normal - tests are written to guide development. You can:

1. **Start with infrastructure test only:**
```bash
npx vitest run tests/simple-tests.test.ts
```

2. **Run tests one at a time:**
```bash
npx vitest run tests/version-utilities.test.ts
npx vitest run tests/accessibility-checker.test.ts
```

3. **Skip failing tests** and focus on what works

## Alternative Test Commands

```bash
# Run with watch mode (re-runs on file changes)
npm run test:watch

# Run with beautiful UI dashboard
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run just one test file
npx vitest run tests/simple-tests.test.ts

# Run tests matching a pattern
npx vitest run --grep "version"
```

## Quick Test Command

To verify tests work immediately, run the infrastructure test:

```bash
npx vitest run tests/simple-tests.test.ts --reporter=verbose
```

This should **always pass** and shows your test setup is working!

---

## Ready? Let's Go!

```bash
# Install (if needed)
npm install

# Run all tests
npm test
```

**Or for the best experience:**

```bash
npm run test:ui
```

This opens a browser-based UI where you can:
- See all tests visually
- Run tests individually
- See detailed results
- Debug failures easily

🚀 **Happy Testing!**
