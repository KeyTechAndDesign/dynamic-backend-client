# Changelog

All notable changes to the Dynamic Backend Client library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-11

### Added
- **Multi-Tenant Blog System V2 Support**:
  - Full CRUD operations in `ApiClient` (POST, PUT, DELETE).
  - New `BlogClient` Admin API for managing Posts, Categories, Tags, and Comments.
  - Support for multi-language translation maps in Admin API.
  - New public endpoints for comments: `getCommentsByPostId` and `createComment`.
  - Comprehensive TypeScript definitions for all new V2 features.
  - New unit tests covering 100% of the V2 changes.

### Changed
- Refactored `BlogClient.getCommentsByPostId` to use the V2 nested endpoint structure.
- Updated `ApiClient` to correctly handle `X-Schema` header for all request methods.
- Refactored and improved existing tests.

## [1.0.3] - 2023-07-01
- Minor bug fixes and performance improvements.

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