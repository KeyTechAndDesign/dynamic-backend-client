# Contributing to Dynamic Backend Client

Thank you for your interest in contributing to the Dynamic Backend Client library! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.

When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** after following the steps
- **Explain which behavior you expected to see instead**
- **Include screenshots or animated GIFs** if possible
- **Include details about your environment** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title** for the issue
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include any relevant code examples** or mockups

### Code Contributions

Code contributions are welcome through pull requests. To contribute code:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Add or update tests as necessary
5. Ensure all tests pass
6. Submit a pull request

## Development Setup

To set up the project for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/KeyTechAndDesign/dynamic-backend-client.git
   cd dynamic-backend-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests to ensure everything is working:
   ```bash
   npm test
   ```

## Pull Request Process

1. Update the README.md and other documentation with details of changes if appropriate
2. Update the CHANGELOG.md with details of changes
3. The PR should work with Node.js 14 or higher
4. Include tests for any new functionality
5. Ensure all tests pass before submitting
6. The PR will be merged once it receives approval from maintainers

## Coding Guidelines

- Follow the existing code style
- Use meaningful variable and function names
- Write JSDoc comments for all public methods and classes
- Keep functions small and focused on a single responsibility
- Use ES6+ features where appropriate

### JavaScript Style Guide

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Use template literals for string interpolation
- Use camelCase for variables and functions
- Use PascalCase for classes
- Avoid using `var`, prefer `const` and `let`

## Testing Guidelines

- Write tests for all new functionality
- Ensure all tests pass before submitting a PR
- Use descriptive test names that explain what is being tested
- Test both success and error cases
- Mock external dependencies

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Thank you for contributing to the Dynamic Backend Client library!