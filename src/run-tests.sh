#!/bin/bash

echo "🧪 Living Design Library - Test Runner"
echo "======================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --save-dev \
        vitest@latest \
        @vitest/ui@latest \
        @testing-library/react@latest \
        @testing-library/jest-dom@latest \
        @testing-library/user-event@latest \
        jsdom@latest \
        happy-dom@latest
    echo "✅ Dependencies installed"
    echo ""
fi

# Run the tests
echo "🏃 Running tests..."
echo ""

# Run simple infrastructure test first
echo "1️⃣ Running simple infrastructure tests..."
npx vitest run tests/simple-tests.test.ts

if [ $? -eq 0 ]; then
    echo "✅ Infrastructure tests passed!"
    echo ""
    
    # Now run version utilities tests
    echo "2️⃣ Running version utilities tests..."
    npx vitest run tests/version-utilities.test.ts
    
    echo ""
    echo "3️⃣ Running accessibility tests..."
    npx vitest run tests/accessibility-checker.test.ts
    
    echo ""
    echo "4️⃣ Running token exporter tests..."
    npx vitest run tests/token-exporter.test.ts
    
    echo ""
    echo "📊 Test Summary"
    echo "==============="
    npx vitest run --reporter=verbose
else
    echo "❌ Infrastructure tests failed!"
    echo "Please check your test setup."
    exit 1
fi

echo ""
echo "✨ Test run complete!"
