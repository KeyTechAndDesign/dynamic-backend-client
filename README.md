# Dynamic Backend Client

[![npm version](https://img.shields.io/npm/v/@keytd/dynamic-backend-client.svg)](https://www.npmjs.com/package/@keytd/dynamic-backend-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@keytd/dynamic-backend-client.svg)](https://nodejs.org)
[![CI](https://github.com/KeyTechAndDesign/dynamic-backend-client/actions/workflows/ci.yml/badge.svg)](https://github.com/KeyTechAndDesign/dynamic-backend-client/actions/workflows/ci.yml)

A JavaScript client library for the Dynamic Backend API, with a companion read-only PHP client in the same repository. It provides a clean, type-documented interface for blog content (public and admin), dynamic tables, and client-side localization.

> **Note:** The public blog and table endpoints are read-only and need no authorization. Since v1.1.0 the JavaScript client also supports write operations (`POST`, `PUT`, `DELETE`) and the Blog Admin API. Admin endpoints require authentication, which you supply through request headers (see [Authentication](#-authentication)).

## 📋 Table of Contents

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [📚 API Reference](#-api-reference)
  - [ApiClient](#apiclient)
  - [BlogClient](#blogclient)
    - [Public API](#public-api)
    - [Admin API](#admin-api)
  - [TableClient](#tableclient)
  - [Localization Utility](#localization-utility)
- [💾 Request Caching](#-request-caching)
- [🔐 Authentication](#-authentication)
- [❌ Error Handling](#-error-handling)
- [🌐 Multilingual Support](#-multilingual-support)
- [🐘 PHP Client](#-php-client)
- [🔄 Compatibility](#-compatibility)
- [🧪 Development](#-development)
- [📖 Related Documentation](#-related-documentation)
- [👥 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

- 🔄 **Framework Agnostic** - Works with any JavaScript environment that supports the Fetch API
- 📊 **Dynamic Tables** - List tables, inspect their structure, and query records with filtering and pagination
- 📝 **Blog Content** - Retrieve posts, categories, tags, and comments, and submit comments
- 🛠️ **Blog Admin API** - Create, update, publish, archive, and delete posts, categories, tags, and comments (Blog System V2)
- 🌐 **Multilingual Support** - `lang` parameter on public endpoints and translation maps on admin endpoints
- 🌍 **Client-side Localization** - Utilities that collapse `name_en` / `nameAz` style fields into a single localized value
- 🏢 **Multi-tenant** - Target a tenant schema through the `X-Schema` header
- 📦 **Optional Request Caching** - In-memory cache for `GET` requests with configurable expiry
- 🛡️ **Type Definitions** - TypeScript definitions shipped in `types/index.d.ts`
- 🚀 **Lightweight** - Zero runtime dependencies
- 🐘 **PHP Client** - Read-only PHP 8 implementation with the same surface for blog, tables, and localization

## 📦 Installation

```bash
# Using npm
npm install @keytd/dynamic-backend-client

# Using yarn
yarn add @keytd/dynamic-backend-client

# Using pnpm
pnpm add @keytd/dynamic-backend-client
```

For the PHP client, see [PHP Client](#-php-client).

## 🚀 Quick Start

### Basic Setup

```javascript
import { ApiClient, BlogClient, TableClient } from '@keytd/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://your-api-url.com',
  schema: 'your_schema',   // Optional, default is 'public'
  timeout: 30000           // Optional, default is 30000ms
});

// Create specialized clients
const blogClient = new BlogClient(apiClient);
const tableClient = new TableClient(apiClient);
```

### Working with Blog Content

```javascript
// Fetch published posts with pagination and filtering
async function fetchBlogPosts() {
  try {
    const posts = await blogClient.getPosts({
      page: 1,
      page_size: 10,
      status: 'published',
      include_tags: true,
      lang: 'en' // Optional language parameter
    });

    console.log('Total posts:', posts.pagination.total);
    console.log('Posts:', posts.data);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}

// Get a specific blog post by slug
async function getPostBySlug(slug) {
  try {
    return await blogClient.getPostBySlug(slug, {
      include_tags: true,
      include_comments: true
    });
  } catch (error) {
    if (error.status === 404) {
      console.error('Post not found');
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

// Submit a visitor comment on a post
async function leaveComment(postId) {
  return blogClient.createComment(postId, {
    author_name: 'Jane Doe',
    author_email: 'jane@example.com',
    content: 'Great article!',
    parent_id: 42 // Optional: reply to an existing comment
  });
}
```

### Working with Dynamic Tables

```javascript
// Fetch records from a dynamic table with filtering
async function fetchTableRecords(tableName) {
  try {
    const records = await tableClient.getRecords(tableName, {
      page: 1,
      pageSize: 20,
      filter: {
        status: 'active',
        category: 'electronics'
      }
    });

    console.log('Total records:', records.pagination.total);
    console.log('Current page:', records.pagination.page);
    console.log('Records:', records.data);
    return records;
  } catch (error) {
    console.error(`Error fetching records from ${tableName}:`, error.message);
  }
}

// Get table structure
async function getTableStructure(tableName) {
  const tableInfo = await tableClient.getTableInfo(tableName);
  console.log('Table columns:', tableInfo.columns);
  return tableInfo;
}
```

### Managing Content with the Admin API

```javascript
// Pass an auth token to the ApiClient by supplying headers on each call,
// or wrap the client (see the Authentication section below).
const authHeaders = { Authorization: `Bearer ${token}` };

// Create a draft post with translations, then publish it
const draft = await apiClient.post('/api/admin/blog/posts', {
  category_id: 1,
  author_id: 1,
  status: 'draft',
  tag_ids: [1, 2],
  translations: [
    { locale: 'en', title: 'Hello', content: 'World' },
    { locale: 'az', title: 'Salam', content: 'Dünya' }
  ]
}, authHeaders);

await apiClient.post(`/api/admin/blog/posts/${draft.id}/publish`, {}, authHeaders);
```

The same operations are available as `BlogClient` convenience methods (`adminCreatePost`, `adminPublishPost`, and so on). See [Admin API](#admin-api) for the full list.

More complete, runnable examples live in the [`examples/`](examples/README.md) directory.

## 📚 API Reference

### ApiClient

The base client that handles HTTP requests, timeouts, caching, and error handling. Every other client takes an `ApiClient` instance in its constructor.

```javascript
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',  // Required: Base URL for the API
  schema: 'public',                    // Optional: Schema for multi-tenant support (default: 'public')
  timeout: 30000,                      // Optional: Request timeout in milliseconds (default: 30000)
  enableCache: true,                   // Optional: Enable GET response caching (default: false)
  cacheMaxAge: 300000                  // Optional: Maximum age of cached responses in ms (default: 300000 - 5 minutes)
});
```

Every request is sent with the headers `Content-Type: application/json`, `Accept: application/json`, and `X-Schema: <schema>`. Any `headers` argument you pass is merged on top of these.

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `setSchema(schema)` | Set the schema for multi-tenant support | `schema` (string): Schema name | `void` |
| `clearCache(endpoint)` | Clear the request cache | `endpoint` (string, optional): Clear only entries whose URL starts with this path (clears all if not specified) | `void` |
| `get(endpoint, params, headers, options)` | Make a GET request | `endpoint` (string): API endpoint<br>`params` (object, optional): Query parameters (`undefined` and `null` values are skipped)<br>`headers` (object, optional): Additional headers<br>`options` (object, optional):<br>- `skipCache` (boolean): Bypass the cache for this request | `Promise<any>`: Response data |
| `post(endpoint, data, headers)` | Make a POST request | `endpoint` (string): API endpoint<br>`data` (object, optional): JSON request body<br>`headers` (object, optional): Additional headers | `Promise<any>`: Response data |
| `put(endpoint, data, headers)` | Make a PUT request | `endpoint` (string): API endpoint<br>`data` (object, optional): JSON request body<br>`headers` (object, optional): Additional headers | `Promise<any>`: Response data |
| `delete(endpoint, headers)` | Make a DELETE request | `endpoint` (string): API endpoint<br>`headers` (object, optional): Additional headers | `Promise<any>`: Response data |

Notes:

- Only `get` uses the cache. Write requests always hit the network.
- A `204 No Content` response resolves to `null`.
- The `endpoint` is appended to `baseUrl` as-is, so include the leading slash (for example `/api/blog/posts`).

### BlogClient

Client for the Blog System V2. It exposes the public, read-mostly endpoints under `/api/blog` and the authenticated admin endpoints under `/api/admin/blog`. See [BLOG_V2_API.md](BLOG_V2_API.md) for the server-side contract.

```javascript
// Basic initialization
const blogClient = new BlogClient(apiClient);

// With custom API path
const blogClient = new BlogClient(apiClient, {
  basePath: '/custom/api/path'  // Optional: Custom base path (default: '/api')
});
```

#### Public API

Public endpoints return content in a single locale, chosen by the `lang` option. Posts and comments are flat objects for that locale.

##### Categories

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getCategories(options)` | Get all blog categories | `options` (object, optional):<br>- `lang` (string): Language code | `Promise<any[]>`: List of categories |
| `getCategoryById(id, options)` | Get a category by ID | `id` (number): Category ID<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Category data |
| `getCategoryBySlug(slug, options)` | Get a category by slug | `slug` (string): Category slug<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Category data |

##### Tags

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getTags(options)` | Get all blog tags | `options` (object, optional):<br>- `lang` (string): Language code | `Promise<any[]>`: List of tags |
| `getTagById(id, options)` | Get a tag by ID | `id` (number): Tag ID<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Tag data |
| `getTagBySlug(slug, options)` | Get a tag by slug | `slug` (string): Tag slug<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Tag data |

##### Posts

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getPosts(options)` | Get blog posts with pagination and filtering | `options` (object, optional):<br>- `page` (number, default: 1): Page number<br>- `page_size` (number, default: 10): Page size<br>- `category_id` (number): Filter by category<br>- `tag_id` (number): Filter by tag<br>- `status` (string): Filter by status (`published`, `draft`, `archived`)<br>- `include_tags` (boolean): Include tags<br>- `lang` (string): Language code | `Promise<any>`: Posts with pagination |
| `getPostById(id, options)` | Get a post by ID | `id` (number): Post ID<br>`options` (object, optional):<br>- `include_tags` (boolean): Include tags<br>- `include_comments` (boolean): Include comments<br>- `lang` (string): Language code | `Promise<any>`: Post data |
| `getPostBySlug(slug, options)` | Get a post by its translated slug | `slug` (string): Post slug<br>`options` (object, optional):<br>- `include_tags` (boolean): Include tags<br>- `include_comments` (boolean): Include comments<br>- `lang` (string): Language code | `Promise<any>`: Post data |

##### Comments

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getCommentsByPostId(postId, options)` | Get approved comments for a post (nested structure) | `postId` (number): Post ID<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any[]>`: List of comments |
| `createComment(postId, data)` | Submit a new comment on a post | `postId` (number): Post ID<br>`data` (object):<br>- `author_name` (string): Author name<br>- `author_email` (string): Author email<br>- `content` (string): Comment content<br>- `parent_id` (number, optional): Parent comment ID for a threaded reply | `Promise<any>`: Created comment |

> Fetching a single comment by ID is an admin-only operation in V2; use `adminGetCommentById`.

#### Admin API

Admin endpoints require authentication (see [Authentication](#-authentication)). They return and accept content in **all** locales at once, using a translation map keyed by locale rather than a `lang` parameter:

```json
{
  "id": 1,
  "translations": {
    "en": { "title": "Welcome", "slug": "welcome", "content": "..." },
    "az": { "title": "Xoş gəlmisiniz", "slug": "xos-gelmisiniz", "content": "..." }
  }
}
```

##### Posts

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `adminGetPosts(options)` | List posts of every status | `options` (object, optional):<br>- `page` (number, default: 1)<br>- `page_size` (number, default: 10) | `Promise<any>`: Posts with pagination |
| `adminGetPostById(id)` | Get a post with all its translations | `id` (number): Post ID | `Promise<any>`: Post data |
| `adminCreatePost(data)` | Create a post | `data` (object): `category_id`, `author_id`, `status`, `tag_ids`, `translations` | `Promise<any>`: Created post |
| `adminUpdatePost(id, data)` | Update a post and its translations | `id` (number): Post ID<br>`data` (object): Fields to update | `Promise<any>`: Updated post |
| `adminDeletePost(id)` | Soft-delete a post | `id` (number): Post ID | `Promise<any>` |
| `adminPublishPost(id)` | Set status to `published` and stamp `published_at` | `id` (number): Post ID | `Promise<any>`: Updated post |
| `adminArchivePost(id)` | Set status to `archived` | `id` (number): Post ID | `Promise<any>`: Updated post |

##### Categories and Tags

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `adminGetCategories()` | List all categories | None | `Promise<any[]>` |
| `adminCreateCategory(data)` | Create a category with translations | `data` (object) | `Promise<any>` |
| `adminUpdateCategory(id, data)` | Update a category | `id` (number), `data` (object) | `Promise<any>` |
| `adminDeleteCategory(id)` | Hard-delete a category | `id` (number) | `Promise<any>` |
| `adminGetTags()` | List all tags | None | `Promise<any[]>` |
| `adminCreateTag(data)` | Create a tag with translations | `data` (object) | `Promise<any>` |
| `adminUpdateTag(id, data)` | Update a tag | `id` (number), `data` (object) | `Promise<any>` |
| `adminDeleteTag(id)` | Hard-delete a tag | `id` (number) | `Promise<any>` |

##### Comments

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `adminGetCommentsByPostId(postId)` | List every comment on a post, including pending and rejected | `postId` (number) | `Promise<any[]>` |
| `adminGetCommentById(id)` | Get a single comment | `id` (number) | `Promise<any>` |
| `adminUpdateComment(id, data)` | Update a comment's status (`approved`, `rejected`) or content | `id` (number), `data` (object) | `Promise<any>` |
| `adminDeleteComment(id)` | Soft-delete a comment | `id` (number) | `Promise<any>` |

### TableClient

Client for working with dynamic tables. It reads table metadata and records from your backend and can localize the results on the client.

```javascript
// Basic initialization
const tableClient = new TableClient(apiClient);

// With custom API path
const tableClient = new TableClient(apiClient, {
  basePath: '/custom/api/path'  // Optional: Custom base path (default: '/api')
});
```

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getTables()` | Get a list of all tables in the current schema | None | `Promise<string[]>`: Array of table names |
| `getTableInfo(tableName)` | Get metadata about a specific table | `tableName` (string): Name of the table | `Promise<Object>`: Table metadata including columns, types, and constraints |
| `getRecords(tableName, options)` | Get records from a table with pagination and filtering | `tableName` (string): Name of the table<br>`options` (object, optional):<br>- `page` (number, default: 1): Page number<br>- `pageSize` (number, default: 10): Number of records per page<br>- `filter` (object): Key-value pairs sent as query parameters (`page` and `pageSize` keys are ignored)<br>- `locale` (string): Localize each returned record (e.g., `'en'`, `'az'`, `'ru'`)<br>- `defaultLocale` (string, default: `'en'`): Fallback locale when the requested one is missing | `Promise<Object>`: Records with pagination information |
| `getRecordById(tableName, id, options)` | Get a single record by ID | `tableName` (string): Name of the table<br>`id` (number\|string): ID of the record<br>`options` (object, optional):<br>- `locale` (string): Localize the returned record<br>- `defaultLocale` (string, default: `'en'`): Fallback locale | `Promise<Object>`: Record data |

#### Example

```javascript
// Get list of available tables
const tables = await tableClient.getTables();
console.log('Available tables:', tables); // ['users', 'products', 'orders', ...]

// Get table structure
const tableInfo = await tableClient.getTableInfo('products');
// {
//   name: 'products',
//   columns: [
//     { name: 'id', type: 'integer', primary: true },
//     { name: 'name', type: 'string', nullable: false },
//     ...
//   ]
// }

// Get filtered records with pagination
const records = await tableClient.getRecords('products', {
  page: 1,
  pageSize: 20,
  filter: { category: 'electronics', status: 'active' }
});

// Get a single record, localized to Russian with English fallback
const product = await tableClient.getRecordById('products', 123, {
  locale: 'ru',
  defaultLocale: 'en'
});
```

#### Response Format

`getRecords` resolves to:

```javascript
{
  data: [
    { id: 1, name: 'Product 1', price: 29.99 /* ... */ },
    { id: 2, name: 'Product 2', price: 49.99 /* ... */ }
  ],
  pagination: {
    total: 157,       // Total number of records
    page: 1,          // Current page
    pageSize: 20,     // Records per page
    totalPages: 8     // Total number of pages
  }
}
```

### Localization Utility

Helpers for data whose translations are stored as suffixed fields on one object (for example `name_en`, `name_az`, `nameRu`). `TableClient` applies them automatically when you pass a `locale`; you can also call them directly.

The helpers are a CommonJS module and are not re-exported from the package root:

```javascript
const { getLocalizedField, localizeObject } = require('@keytd/dynamic-backend-client/lib/localizeUtil');
```

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getLocalizedField(obj, baseFieldName, locale, defaultLocale)` | Read one field in the requested locale, falling back to `defaultLocale` and then to the un-suffixed base field | `obj` (object): The object containing localized fields<br>`baseFieldName` (string): Field name without the locale suffix<br>`locale` (string): Requested locale<br>`defaultLocale` (string, default: `'en'`): Fallback locale | The localized value, or `undefined` |
| `localizeObject(obj, locale, defaultLocale)` | Return a new object where every localized field group is collapsed into a single base field | `obj` (object): The object containing localized fields<br>`locale` (string): Requested locale<br>`defaultLocale` (string, default: `'en'`): Fallback locale | A new object with localized fields |

#### Supported Field Naming Patterns

Two naming conventions are recognized, and both are checked:

1. **CamelCase suffix**: `fieldNameLocale` (e.g., `nameEn`, `descriptionAz`)
2. **Underscore suffix**: `field_name_locale` (e.g., `name_en`, `description_az`)

`getLocalizedField` works with any locale code. `localizeObject` currently detects only the `az`, `en`, and `ru` suffixes when deciding which keys are translations; fields with other suffixes are passed through unchanged.

#### Example

```javascript
const product = {
  id: 1,
  nameEn: 'Laptop',
  nameAz: 'Noutbuk',
  nameRu: 'Ноутбук',
  description_en: 'Powerful laptop for professionals',
  description_az: 'Peşəkarlar üçün güclü noutbuk',
  price: 999.99
};

getLocalizedField(product, 'name', 'az');        // 'Noutbuk'
getLocalizedField(product, 'description', 'ru'); // falls back to 'en': 'Powerful laptop for professionals'

localizeObject(product, 'az');
// {
//   id: 1,
//   name: 'Noutbuk',
//   description: 'Peşəkarlar üçün güclü noutbuk',
//   price: 999.99
// }
```

## 💾 Request Caching

Caching is off by default. When enabled, `GET` responses are stored in memory, keyed by URL and headers, and reused until `cacheMaxAge` elapses.

```javascript
const apiClient = new ApiClient({
  baseUrl: 'https://your-api-url.com',
  schema: 'your_schema',
  enableCache: true,                // Enable caching (default: false)
  cacheMaxAge: 5 * 60 * 1000        // Cache expiry time in ms (default: 5 minutes)
});

// First call hits the network and is cached
const first = await apiClient.get('/api/blog/posts', { page: 1 });

// Second identical call within cacheMaxAge is served from cache
const second = await apiClient.get('/api/blog/posts', { page: 1 });

// Bypass the cache for one request
const fresh = await apiClient.get('/api/blog/posts', { page: 1 }, {}, { skipCache: true });

// Clear cache entries for one endpoint prefix, or everything
apiClient.clearCache('/api/blog/posts');
apiClient.clearCache();
```

Write requests are never cached, and they do not invalidate cached `GET` responses. Call `clearCache` after a mutation if you need the next read to be fresh.

## 🔐 Authentication

The client does not manage credentials. Public endpoints need none. For the Admin API, pass whatever header your backend expects through the `headers` argument of the `ApiClient` methods:

```javascript
const authHeaders = { Authorization: `Bearer ${token}` };

const posts = await apiClient.get('/api/admin/blog/posts', { page: 1 }, authHeaders);
await apiClient.put(`/api/admin/blog/posts/${id}`, { status: 'draft' }, authHeaders);
```

The `BlogClient` admin methods do not take a `headers` argument. If you prefer them, wrap the `ApiClient` so the header is added on every request:

```javascript
class AuthenticatedApiClient extends ApiClient {
  constructor(config, token) {
    super(config);
    this.token = token;
  }

  _createHeaders(additionalHeaders = {}) {
    return super._createHeaders({ Authorization: `Bearer ${this.token}`, ...additionalHeaders });
  }
}

const blogClient = new BlogClient(new AuthenticatedApiClient({ baseUrl, schema }, token));
await blogClient.adminPublishPost(42);
```

## ❌ Error Handling

All methods return promises. When the server responds with a non-2xx status, the rejection is an `Error` with extra properties:

| Property | Type | Description |
|----------|------|-------------|
| `status` | number | HTTP status code (e.g., 404, 500) |
| `statusText` | string | HTTP status text (e.g., "Not Found") |
| `message` | string | Message from the response body (`message` or `error`), or a default for the status code |
| `url` | string | The URL that caused the error |
| `details` | object | `details` or `errors` from the response body, or `null` |

A request that exceeds `timeout` rejects with a plain `Error` whose message is `Request timeout after <timeout>ms`; it has no `status`. Network failures reject with the underlying `fetch` error.

### Common Error Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|--------------|
| 400 | Bad Request | Invalid parameters or malformed request |
| 401 | Unauthorized | Authentication required (Admin API) |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Server is temporarily unavailable |

### Example

```javascript
try {
  const posts = await blogClient.getPosts();
} catch (error) {
  if (error.status === 404) {
    console.error('Resource not found');
  } else if (error.status === 429) {
    console.error('Rate limit exceeded. Please try again later.');
  } else if (error.status >= 500) {
    console.error('Server error. Please try again later.');
  } else {
    console.error(`Error: ${error.message}`);
    console.debug({
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      details: error.details
    });
  }
}
```

Client-side validation failures (for example calling `getPostById` without an ID) reject with an `Error` that has a descriptive message and no `status`.

## 🌐 Multilingual Support

There are three layers of language handling:

1. **Public blog endpoints** accept a `lang` option and return a flat object in that locale. The backend falls back to the `Accept-Language` header and then to `en`.
2. **Admin blog endpoints** exchange translation maps keyed by locale, so a single call reads or writes every language.
3. **Dynamic tables** store translations as suffixed columns; pass `locale` to `TableClient` (or use the [Localization Utility](#localization-utility)) to collapse them on the client.

```javascript
// Public blog content in Spanish
const spanishPosts = await blogClient.getPosts({ lang: 'es', page: 1, page_size: 10 });
const frenchCategory = await blogClient.getCategoryBySlug('technology', { lang: 'fr' });

// Admin: create a post with two translations
await blogClient.adminCreatePost({
  category_id: 1,
  author_id: 1,
  status: 'draft',
  translations: [
    { locale: 'en', title: 'Hello', content: 'World' },
    { locale: 'az', title: 'Salam', content: 'Dünya' }
  ]
});

// Tables: localize records client-side
const products = await tableClient.getRecords('products', { locale: 'az', defaultLocale: 'en' });
```

### Multi-tenancy

Every request carries an `X-Schema` header. Set it at construction time or switch tenants at runtime:

```javascript
const apiClient = new ApiClient({ baseUrl, schema: 'tenant_a' });
apiClient.setSchema('tenant_b');
```

## 🐘 PHP Client

The `php/` directory contains a read-only PHP 8 implementation with the same surface as the JavaScript client for public blog content, tables, and localization.

### Installation

The package name is `keytd/dynamic-backend-client-php`. It is not yet on Packagist, so install it from this repository:

**VCS repository (recommended)**

```json
{
  "repositories": [
    { "type": "vcs", "url": "https://github.com/KeyTechAndDesign/dynamic-backend-client" }
  ],
  "require": {
    "php": ">=8.0",
    "keytd/dynamic-backend-client-php": "dev-main"
  }
}
```

```bash
composer update keytd/dynamic-backend-client-php
```

**Local path repository**

```json
{
  "repositories": [
    { "type": "path", "url": "../dynamic-backend-client" }
  ],
  "require": {
    "keytd/dynamic-backend-client-php": "dev-main"
  }
}
```

**Copy-only**

Copy the `php/` directory into your project and map the namespace in your own `composer.json`:

```json
{
  "autoload": {
    "psr-4": {
      "KeyTD\\DynamicBackendClient\\": "php/"
    }
  }
}
```

Then run `composer dump-autoload`.

Once the package is published, `composer require keytd/dynamic-backend-client-php` will work directly.

### Quick Start

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use KeyTD\DynamicBackendClient\ApiClient;
use KeyTD\DynamicBackendClient\BlogClient;
use KeyTD\DynamicBackendClient\TableClient;

$apiClient = new ApiClient([
    'baseUrl' => 'https://your-api-url.com',
    'schema' => 'your_schema',
    'timeout' => 30000, // milliseconds
    'enableCache' => true,
]);

$blog = new BlogClient($apiClient);
$table = new TableClient($apiClient);

// Fetch posts
$posts = $blog->getPosts([
    'page' => 1,
    'page_size' => 10,
    'status' => 'published',
    'include_tags' => true,
    'lang' => 'en',
]);

// Fetch records from a table with localization
$records = $table->getRecords('products', [
    'page' => 1,
    'pageSize' => 10,
    'filter' => ['category' => 'electronics'],
    'locale' => 'en',
    'defaultLocale' => 'en',
]);

// Fetch comments for a post
$comments = $blog->getCommentsByPostId(123, [
    'status' => 'approved', // default
    'lang' => 'en',
]);

// Fetch a single comment by ID
$comment = $blog->getCommentById(456, ['lang' => 'en']);
```

### Status

- **Scope**: GET-only. `ApiClient` (cURL-based HTTP, timeout, `X-Schema` header, optional in-memory caching), `BlogClient`, `TableClient`, and `LocalizeUtil`.
- **Not included**: `POST`, `PUT`, `DELETE`, the Blog Admin API, and comment submission. Use the JavaScript client for write operations.
- **Endpoint differences**: The PHP `BlogClient` still targets the V1 comment routes (`/blog/comments/post/{id}` and `/blog/comments/{id}`) and accepts a `status` option, whereas the JavaScript client uses the V2 route `/blog/posts/{id}/comments`.
- **Requirements**: PHP 8.0 or newer with `ext-curl` enabled.
- **Tests**: PHPUnit suite with stubbed transport (no network). Run with `composer install && composer test`.

### Troubleshooting

- **Class not found**: Make sure `vendor/autoload.php` is required. With the copy-only approach, confirm the PSR-4 mapping points at `php/` and run `composer dump-autoload`.
- **cURL errors**: Enable `ext-curl` (`php-curl` on most Linux distributions, or uncomment the extension in `php.ini` on Windows).
- **Timeouts**: `timeout` is in milliseconds.
- **Caching**: Pass `enableCache => true` and optionally `cacheMaxAge` (ms) to `ApiClient`.

### Publishing to Packagist (maintainers)

Packagist can consume this monorepo directly because `composer.json` sits at the repository root. `.gitattributes` marks JavaScript sources, tests, and tooling as `export-ignore`, so Composer dist archives contain only the PHP files.

1. Confirm `composer.json` is correct (package name, license, PSR-4 autoload).
2. Tag a release and push the tag, for example `git tag v0.1.0 && git push origin v0.1.0`.
3. Submit the repository URL at https://packagist.org.
4. Enable the GitHub auto-update hook on the Packagist package page so new tags are picked up automatically.

A separate repository is only worth it if you want independent issue tracking or a different release cadence for PHP and JavaScript.

## 🔄 Compatibility

### Runtime Requirements

| Dependency | Minimum Version | Notes |
|------------|-----------------|-------|
| Node.js | 14.0.0 | Native `fetch` and `AbortController` are available from Node.js 18. On 14 and 16, provide a global `fetch` polyfill (for example `node-fetch` or `undici`). |
| PHP | 8.0 | `ext-curl` required |

### Browser Support

The JavaScript client runs in any environment with `Promise`, `fetch`, `AbortController`, and ES2015 support. That covers all modern browsers, Node.js 18+, and frameworks such as React, Vue, Angular, and Next.js.

### Module Format

The package ships untranspiled ES module sources (`index.js` and `lib/`). Use a bundler or an ESM-aware runtime, or transpile with Babel as the test setup does.

### TypeScript Support

Type definitions are included in `types/index.d.ts` and cover `ApiClient`, `BlogClient` (public and admin), and `TableClient`.

## 🧪 Development

```bash
git clone https://github.com/KeyTechAndDesign/dynamic-backend-client.git
cd dynamic-backend-client
npm install

npm test               # Run the Jest suite
npm run test:watch     # Re-run on change
npm run test:coverage  # Coverage report for lib/

npm run docs           # Generate JSDoc HTML into docs/
npm run docs:serve     # Serve the generated docs locally

composer install && composer test   # PHP tests
```

Tests mock the network and live in [`tests/`](tests/README.md); the CI workflow runs them on Node.js 14, 16, and 18.

## 📖 Related Documentation

- [Examples](examples/README.md) - Runnable scripts for basic usage, blog operations, table operations, and advanced features
- [Blog System V2 API](BLOG_V2_API.md) - Endpoint reference for the public and admin blog APIs
- [Blog System V2 Schema](BLOG_V2_SCHEMA.md) - Database schema and translation model behind the blog API
- [Changelog](CHANGELOG.md)
- [Contributing Guide](CONTRIBUTING.md)

## 👥 Contributing

Contributions are welcome. Read the [Contributing Guide](CONTRIBUTING.md) for the pull request process, coding style, and testing expectations, then open a pull request with a clear description of your change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
