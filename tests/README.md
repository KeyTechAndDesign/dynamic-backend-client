# Dynamic Backend Client Tests

This directory contains unit tests for the Dynamic Backend Client library. The tests are written using [Jest](https://jestjs.io/), a popular JavaScript testing framework.

## 🧪 Running the Tests

To run the tests, you'll need to:

1. Install the development dependencies:
   ```bash
   npm install
   ```

2. Run the tests:
   ```bash
   npm test
   ```

3. Run the tests in watch mode (automatically re-run when files change):
   ```bash
   npm run test:watch
   ```

4. Run the tests with coverage reporting:
   ```bash
   npm run test:coverage
   ```

## 📋 Test Structure

The tests are organized by client class:

- **apiClient.test.js**: Tests for the base ApiClient class
- **blogClient.test.js**: Tests for the BlogClient class
- **tableClient.test.js**: Tests for the TableClient class

Each test file follows a similar structure:
1. Import the class being tested
2. Create mock dependencies
3. Define test suites for each method or functionality
4. Write individual test cases

## 🔍 Test Coverage

The tests aim to cover:
- Constructor behavior and validation
- Method parameter validation
- Correct API endpoint construction
- Proper handling of responses
- Error handling

## 🛠️ Adding New Tests

When adding new tests:

1. Follow the existing pattern for consistency
2. Use descriptive test names that explain what is being tested
3. Mock external dependencies (like the ApiClient in client tests)
4. Test both success and error cases
5. Verify that methods throw appropriate errors for invalid inputs

## 🔄 Continuous Integration

These tests are designed to be run in a CI/CD pipeline. The Jest configuration is set up to:
- Generate coverage reports
- Fail if tests don't pass
- Work with Babel to support ES modules