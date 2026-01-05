@echo off
echo.
echo 🧪 Living Design Library - Test Runner
echo ======================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install --save-dev vitest@latest @vitest/ui@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest jsdom@latest happy-dom@latest
    echo ✅ Dependencies installed
    echo.
)

REM Run the tests
echo 🏃 Running tests...
echo.

echo 1️⃣ Running simple infrastructure tests...
call npx vitest run tests/simple-tests.test.ts

if %ERRORLEVEL% == 0 (
    echo ✅ Infrastructure tests passed!
    echo.
    
    echo 2️⃣ Running version utilities tests...
    call npx vitest run tests/version-utilities.test.ts
    
    echo.
    echo 3️⃣ Running accessibility tests...
    call npx vitest run tests/accessibility-checker.test.ts
    
    echo.
    echo 4️⃣ Running token exporter tests...
    call npx vitest run tests/token-exporter.test.ts
    
    echo.
    echo 📊 All tests
    call npx vitest run --reporter=verbose
) else (
    echo ❌ Infrastructure tests failed!
    echo Please check your test setup.
    exit /b 1
)

echo.
echo ✨ Test run complete!
pause
