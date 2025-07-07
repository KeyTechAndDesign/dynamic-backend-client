# Changelog

All notable changes to the Dynamic Backend Client library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive examples directory with sample code for different use cases
- Unit tests for all client classes with Jest
- Test configuration in package.json
- Babel configuration for ES modules support in tests
- README files for examples and tests directories
- This CHANGELOG file

### Changed
- Improved error handling in ApiClient with more detailed error messages
- Enhanced parameter validation in all client classes
- Updated README with more detailed documentation and examples
- Removed Next.js dependency, making the library framework-agnostic

### Fixed
- Fixed potential issue with filter parameters overriding pagination in TableClient
- Removed redundant tableClient.js file from root directory

## [1.0.2] - 2023-06-15

### Added
- Complete TypeScript definitions in types/index.d.ts
- Added multilingual support documentation

### Changed
- Updated README with more examples
- Improved error handling

## [1.0.1] - 2023-05-30

### Fixed
- Fixed issue with URL encoding in query parameters
- Corrected TypeScript definitions

## [1.0.0] - 2023-05-15

### Added
- Initial release of the Dynamic Backend Client
- ApiClient for base API operations
- BlogClient for blog-related operations
- TableClient for dynamic table operations
- Basic documentation