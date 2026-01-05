# 🧪 Test Execution Guide

## When You Run `npm test`

### Command Flow

```
npm test
  ↓
vitest (from package.json)
  ↓
Loads vitest.config.ts
  ↓
Finds all *.test.ts and *.test.tsx files in tests/
  ↓
Runs each test file
  ↓
Shows results
```

## Test Files That Will Run

```
tests/
├── simple-tests.test.ts              ✅ (15 tests - Infrastructure)
├── version-utilities.test.ts         ✅ (20+ tests)
├── accessibility-checker.test.ts     ✅ (35+ tests)
├── token-exporter.test.ts           ✅ (50+ tests)
├── token-utilities.test.ts          ✅ (40+ tests)
├── code-generators.test.ts          ✅ (45+ tests)
├── hooks/
│   ├── useDesignSystems.test.tsx    ✅ (30+ tests)
│   └── useTheme.test.tsx            ✅ (25+ tests)
└── integration/
    └── complete-workflow.test.ts     ✅ (15+ tests)
```

## Visual Test Output

### ✅ Success Output
```
 ✓ tests/simple-tests.test.ts (15)
   ✓ Test Infrastructure (15)
     ✓ Basic JavaScript (4)
       ✓ should handle arithmetic
       ✓ should handle strings  
       ✓ should handle arrays
       ✓ should handle objects
     ✓ Array Methods (3)
       ✓ should filter arrays
       ✓ should map arrays
       ✓ should reduce arrays
     ✓ Async Operations (2)
       ✓ should handle promises
       ✓ should handle async functions
     ✓ Error Handling (2)
       ✓ should catch errors
       ✓ should handle try-catch
   ✓ Import Tests (1)
     ✓ should be able to run tests

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Duration  142ms (in thread 45ms, 315.56%)
```

### ❌ Failure Output (if any)
```
 ✓ tests/simple-tests.test.ts (15)
 ❌ tests/version-utilities.test.ts (18/20)
   ✓ parseVersion (3)
   ✓ incrementVersion (4)
   ❌ compareVersions (2/3)
     ✓ should compare major versions
     ✓ should compare minor versions
     ❌ should handle invalid input
       Expected: 0
       Received: NaN

 Test Files  1 passed | 1 failed (2)
      Tests  33 passed | 2 failed (35)
   Duration  234ms
```

## Running Individual Test Suites

### Test Each Function Category

```bash
# Version management
npx vitest run tests/version-utilities.test.ts

# Accessibility 
npx vitest run tests/accessibility-checker.test.ts

# Token export
npx vitest run tests/token-exporter.test.ts

# Code generation
npx vitest run tests/code-generators.test.ts

# React hooks
npx vitest run tests/hooks/

# Integration tests
npx vitest run tests/integration/
```

## Watch Mode (Interactive)

```bash
npm run test:watch
```

**Output:**
```
 Waiting for file changes...
 
 Press a to rerun all tests
 Press f to rerun only failed tests
 Press u to update snapshots
 Press p to filter by filename
 Press t to filter by test name
 Press q to quit
```

## Coverage Mode

```bash
npm run test:coverage
```

**Generates:**
- Terminal coverage summary
- HTML report in `coverage/index.html`
- JSON report for CI/CD

**Sample Output:**
```
 Coverage Report
 ---------------
 File                        | % Stmts | % Branch | % Funcs | % Lines
-----------------------------|---------|----------|---------|--------
 lib/version-utilities.ts    |   95.2  |   91.3   |   100   |  95.2
 utils/accessibilityChecker  |   92.1  |   88.5   |   95.8  |  92.1
 utils/tokenExporter.ts      |   96.8  |   93.2   |   100   |  96.8
 lib/code-generators.ts      |   91.4  |   87.9   |   94.1  |  91.4
-----------------------------|---------|----------|---------|--------
 All files                   |   93.5  |   89.8   |   96.2  |  93.5
```

## UI Mode (Best Experience!)

```bash
npm run test:ui
```

**Opens browser with:**
- Visual test tree
- Click to run individual tests
- See code coverage
- Debug in DevTools
- Beautiful charts and graphs

**URL:** http://localhost:51204/__vitest__/

## Debug Mode

```bash
# Run with Node debugger
node --inspect-brk ./node_modules/.bin/vitest run

# Or use VS Code debugger
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

## Common Scenarios

### ✅ Quick Verification
```bash
npx vitest run tests/simple-tests.test.ts
```
**Use when:** You want to verify test infrastructure works

### 🔄 Development Mode
```bash
npm run test:watch
```
**Use when:** You're actively writing code/tests

### 📊 Pre-Commit Check
```bash
npm run test:coverage
```
**Use when:** Before committing to ensure coverage standards

### 🎨 Exploration Mode  
```bash
npm run test:ui
```
**Use when:** Exploring tests, debugging, or presenting

### 🚀 CI/CD Pipeline
```bash
npm run test:run
```
**Use when:** In automated pipelines (exits after running)

## Test Execution Time

| Test Suite | Approx. Time | Tests |
|------------|--------------|-------|
| simple-tests | 50ms | 15 |
| version-utilities | 120ms | 20 |
| accessibility-checker | 200ms | 35 |
| token-exporter | 300ms | 50 |
| token-utilities | 250ms | 40 |
| code-generators | 280ms | 45 |
| hooks (both) | 350ms | 55 |
| integration | 400ms | 15 |
| **Total** | **~2-3 seconds** | **275** |

## Troubleshooting

### Tests Don't Start
```bash
# Check if vitest is installed
npx vitest --version

# Reinstall if needed
npm install --save-dev vitest
```

### Import Errors
```bash
# Check TypeScript config
npx tsc --noEmit

# Verify paths in vitest.config.ts
```

### Slow Tests
```bash
# Run with specific timeout
vitest run --testTimeout=10000

# Run in parallel (default)
vitest run --threads

# Run in single thread (slower but more predictable)
vitest run --no-threads
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm test
```

## Next Steps After Running Tests

1. ✅ **All Pass** → Great! You're ready to develop
2. ⚠️ **Some Fail** → Normal, tests guide implementation
3. ❌ **Many Fail** → Check dependencies and imports
4. 🐛 **Errors** → Review error messages, update imports

---

## 🎯 Ready to Run?

```bash
npm test
```

**That's it!** The tests will run and show you results in seconds.

For the best experience, try:
```bash
npm run test:ui
```

Happy Testing! 🚀
