# Dynamic Backend Client

[![npm version](https://img.shields.io/npm/v/@keytd/dynamic-backend-client.svg)](https://www.npmjs.com/package/@keytd/dynamic-backend-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@keytd/dynamic-backend-client.svg)](https://nodejs.org)

A JavaScript client library for interacting with the Dynamic Backend API. This library provides a clean, type-documented interface for working with blog content and dynamic tables.

> **Note:** This library only supports GET requests and does not require authorization. It is designed for read-only operations with public APIs.

## 📋 Table of Contents

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [📚 API Reference](#-api-reference)
  - [ApiClient](#apiclient)
  - [BlogClient](#blogclient)
  - [TableClient](#tableclient)
  - [Localization Utility](#localization-utility)
- [❌ Error Handling](#-error-handling)
- [🌐 Multilingual Support](#-multilingual-support)
- [🔄 Compatibility](#-compatibility)
- [👥 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

- 🔄 **Framework Agnostic** - Works with any JavaScript environment that supports the Fetch API
- 📊 **Dynamic Tables** - Access and query dynamic database tables
- 📝 **Blog Content** - Retrieve blog posts, categories, tags, and comments
- 🌐 **Multilingual Support** - Built-in support for multilingual content
- 🔍 **Filtering & Pagination** - Filter records and paginate results
- 🛡️ **Type Definitions** - Complete TypeScript definitions for better development experience
- 🚀 **Lightweight** - Minimal dependencies for faster loading
- 🧩 **Modular Design** - Use only the components you need
- 📦 **Optional Request Caching** - Built-in caching mechanism that can be enabled for improved performance and reduced API calls
- 🌍 **Client-side Localization** - Utilities for handling localized fields in data objects

## 📦 Installation

```bash
# Using npm
npm install @keytd/dynamic-backend-client

# Using yarn
yarn add @keytd/dynamic-backend-client

# Using pnpm
pnpm add @keytd/dynamic-backend-client
```

## 🚀 Quick Start

### Basic Setup

```javascript
import { ApiClient, BlogClient, TableClient } from '@keytd/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://your-api-url.com',
  schema: 'your_schema',
  timeout: 30000 // Optional, default is 30000ms
});

// Create specialized clients
const blogClient = new BlogClient(apiClient);
const tableClient = new TableClient(apiClient);
```

### Working with Blog Content

```javascript
// Fetch blog posts with pagination and filtering
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
    // Handle error appropriately
  }
}

// Get a specific blog post by slug
async function getPostBySlug(slug) {
  try {
    const post = await blogClient.getPostBySlug(slug, {
      include_tags: true,
      include_comments: true
    });

    return post;
  } catch (error) {
    if (error.status === 404) {
      console.error('Post not found');
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}
```

### Working with Request Caching

```javascript
// Configure caching when creating the API client (caching is disabled by default)
const apiClient = new ApiClient({
  baseUrl: 'https://your-api-url.com',
  schema: 'your_schema',
  enableCache: true,                // Enable caching (default: false)
  cacheMaxAge: 5 * 60 * 1000        // Cache expiry time in ms (default: 5 minutes)
});

// Make a request that will be cached (since we enabled caching)
async function fetchDataWithCache() {
  try {
    // This response will be cached (because we enabled caching)
    const firstResponse = await apiClient.get('/endpoint', { param: 'value' });
    console.log('First request:', firstResponse);

    // This will use the cached response if within cacheMaxAge
    const secondResponse = await apiClient.get('/endpoint', { param: 'value' });
    console.log('Second request (from cache):', secondResponse);

    // Skip cache for this specific request
    const freshResponse = await apiClient.get('/endpoint', { param: 'value' }, {}, { skipCache: true });
    console.log('Fresh request (bypassing cache):', freshResponse);

    // Clear cache for a specific endpoint
    apiClient.clearCache('/endpoint');

    // Clear the entire cache
    apiClient.clearCache();
  } catch (error) {
    console.error('Error:', error.message);
  }
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
    // Handle error appropriately
  }
}

// Get table structure
async function getTableStructure(tableName) {
  try {
    const tableInfo = await tableClient.getTableInfo(tableName);
    console.log('Table columns:', tableInfo.columns);
    return tableInfo;
  } catch (error) {
    console.error(`Error fetching table info: ${error.message}`);
  }
}
```

## 📚 API Reference

### ApiClient

The base client that handles error handling and HTTP requests.

```javascript
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',  // Required: Base URL for the API
  schema: 'public',                    // Optional: Schema for multi-tenant support (default: 'public')
  timeout: 30000,                      // Optional: Request timeout in milliseconds (default: 30000)
  enableCache: true,                   // Optional: Enable response caching (default: false)
  cacheMaxAge: 300000                  // Optional: Maximum age of cached responses in ms (default: 300000 - 5 minutes)
});
```

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `setSchema(schema)` | Set the schema for multi-tenant support | `schema` (string): Schema name | `void` |
| `clearCache(endpoint)` | Clear the request cache | `endpoint` (string, optional): Specific endpoint to clear (clears all if not specified) | `void` |
| `get(endpoint, params, headers, options)` | Make a GET request | `endpoint` (string): API endpoint<br>`params` (object, optional): Query parameters<br>`headers` (object, optional): Additional headers<br>`options` (object, optional):<br>- `skipCache` (boolean): Skip cache for this request | `Promise<any>`: Response data |

### BlogClient

Client for working with blog-related content such as posts, categories, tags, and comments.

```javascript
// Basic initialization
const blogClient = new BlogClient(apiClient);

// With custom API path
const blogClient = new BlogClient(apiClient, {
  basePath: '/custom/api/path'  // Optional: Custom base path (default: '/api')
});
```

#### Categories Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getCategories(options)` | Get all blog categories | `options` (object, optional):<br>- `lang` (string): Language code | `Promise<any[]>`: List of categories |
| `getCategoryById(id, options)` | Get a category by ID | `id` (number): Category ID<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Category data |
| `getCategoryBySlug(slug, options)` | Get a category by slug | `slug` (string): Category slug<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Category data |

#### Tags Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getTags(options)` | Get all blog tags | `options` (object, optional):<br>- `lang` (string): Language code | `Promise<any[]>`: List of tags |
| `getTagById(id, options)` | Get a tag by ID | `id` (number): Tag ID<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Tag data |
| `getTagBySlug(slug, options)` | Get a tag by slug | `slug` (string): Tag slug<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Tag data |

#### Posts Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getPosts(options)` | Get all blog posts with pagination and filtering | `options` (object, optional):<br>- `page` (number): Page number<br>- `page_size` (number): Page size<br>- `category_id` (number): Filter by category<br>- `tag_id` (number): Filter by tag<br>- `status` (string): Filter by status<br>- `include_tags` (boolean): Include tags<br>- `lang` (string): Language code | `Promise<any>`: Posts with pagination |
| `getPostById(id, options)` | Get a post by ID | `id` (number): Post ID<br>`options` (object, optional):<br>- `include_tags` (boolean): Include tags<br>- `include_comments` (boolean): Include comments<br>- `lang` (string): Language code | `Promise<any>`: Post data |
| `getPostBySlug(slug, options)` | Get a post by slug | `slug` (string): Post slug<br>`options` (object, optional):<br>- `include_tags` (boolean): Include tags<br>- `include_comments` (boolean): Include comments<br>- `lang` (string): Language code | `Promise<any>`: Post data |

#### Comments Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getCommentsByPostId(postId, options)` | Get comments for a post | `postId` (number): Post ID<br>`options` (object, optional):<br>- `status` (string): Filter by status<br>- `lang` (string): Language code | `Promise<any[]>`: List of comments |
| `getCommentById(id, options)` | Get a comment by ID | `id` (number): Comment ID<br>`options` (object, optional):<br>- `lang` (string): Language code | `Promise<any>`: Comment data |

### TableClient

Client for working with dynamic tables. The TableClient provides a simple interface for retrieving data from dynamic database tables in your backend.

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
| `getRecords(tableName, options)` | Get records from a table with pagination and filtering | `tableName` (string): Name of the table<br>`options` (object, optional):<br>- `page` (number, default: 1): Page number<br>- `pageSize` (number, default: 10): Number of records per page<br>- `filter` (object): Key-value pairs for filtering records<br>- `locale` (string): Locale for localizing the returned data (e.g., 'en', 'az', 'ru')<br>- `defaultLocale` (string, default: 'en'): Default locale to fall back to if the requested locale is not available | `Promise<Object>`: Records with pagination information |
| `getRecordById(tableName, id, options)` | Get a single record by ID | `tableName` (string): Name of the table<br>`id` (number\|string): ID of the record<br>`options` (object, optional):<br>- `locale` (string): Locale for localizing the returned data (e.g., 'en', 'az', 'ru')<br>- `defaultLocale` (string, default: 'en'): Default locale to fall back to if the requested locale is not available | `Promise<Object>`: Record data |

### Localization Utility

Utility functions for handling localized fields in data objects. These utilities help you work with multilingual content when the backend returns fields with locale suffixes.

```javascript
import { getLocalizedField, localizeObject } from '@keytd/dynamic-backend-client';
```

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getLocalizedField(obj, baseFieldName, locale, defaultLocale)` | Extracts the localized value from an object based on the provided locale | `obj` (object): The object containing localized fields<br>`baseFieldName` (string): The base name of the field without locale suffix<br>`locale` (string): The current locale (e.g., 'az', 'en', 'ru')<br>`defaultLocale` (string, optional): The fallback locale if the requested locale is not available (default: 'en') | The localized value or undefined if not found |
| `localizeObject(obj, locale, defaultLocale)` | Processes an object to replace all fields that have localized versions with their localized values | `obj` (object): The object containing localized fields<br>`locale` (string): The current locale (e.g., 'az', 'en', 'ru')<br>`defaultLocale` (string, optional): The fallback locale if the requested locale is not available (default: 'en') | A new object with localized fields |

#### Example Usage

```javascript
// Example data with localized fields
const product = {
  id: 1,
  nameEn: 'Laptop',
  nameAz: 'Noutbuk',
  nameRu: 'Ноутбук',
  description_en: 'Powerful laptop for professionals',
  description_az: 'Peşəkarlar üçün güclü noutbuk',
  description_ru: 'Мощный ноутбук для профессионалов',
  price: 999.99,
  inStock: true
};

// Get a specific localized field
const productName = getLocalizedField(product, 'name', 'en'); // Returns 'Laptop'
const productNameAz = getLocalizedField(product, 'name', 'az'); // Returns 'Noutbuk'
const productDesc = getLocalizedField(product, 'description', 'ru'); // Returns 'Мощный ноутбук для профессионалов'

// Fallback to default locale if requested locale is not available
const productNameFr = getLocalizedField(product, 'name', 'fr', 'en'); // Returns 'Laptop' (fallback to English)

// Localize the entire object
const localizedProduct = localizeObject(product, 'az');
console.log(localizedProduct);
// Output:
// {
//   id: 1,
//   name: 'Noutbuk',
//   description: 'Peşəkarlar üçün güclü noutbuk',
//   price: 999.99,
//   inStock: true
// }

// Working with API responses
async function getLocalizedProducts(locale = 'en') {
  try {
    // Fetch products from API
    const response = await apiClient.get('/products');

    // Localize each product in the response
    const localizedProducts = response.data.map(product => 
      localizeObject(product, locale)
    );

    return localizedProducts;
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}
```

#### Supported Field Naming Patterns

The localization utility supports two common naming patterns for localized fields:

1. **CamelCase format**: `fieldNameLocale` (e.g., `nameEn`, `descriptionAz`)
2. **Underscore format**: `field_name_locale` (e.g., `name_en`, `description_az`)

The utility will check both formats when looking for localized fields.

#### Working with Dynamic Tables

```javascript
// Get list of available tables
const tables = await tableClient.getTables();
console.log('Available tables:', tables); // ['users', 'products', 'orders', ...]

// Get table structure
const tableInfo = await tableClient.getTableInfo('products');
console.log('Table structure:', tableInfo);
// {
//   name: 'products',
//   columns: [
//     { name: 'id', type: 'integer', primary: true },
//     { name: 'name', type: 'string', nullable: false },
//     { name: 'price', type: 'decimal', nullable: false },
//     { name: 'category', type: 'string', nullable: true },
//     { name: 'created_at', type: 'timestamp', nullable: false }
//   ]
// }

// Get filtered records with pagination
const records = await tableClient.getRecords('products', {
  page: 1,
  pageSize: 20,
  filter: {
    category: 'electronics',
    status: 'active'
  }
});

console.log('Total records:', records.pagination.total);
console.log('Current page:', records.pagination.page);
console.log('Records:', records.data);

// Get a single record by ID
const product = await tableClient.getRecordById('products', 123);
console.log('Product details:', product);

// Get localized records with automatic field localization
const localizedRecords = await tableClient.getRecords('products', {
  page: 1,
  pageSize: 20,
  filter: {
    category: 'electronics'
  },
  locale: 'az', // Get records localized to Azerbaijani
  defaultLocale: 'en' // Fall back to English if Azerbaijani translation is not available
});

console.log('Localized records:', localizedRecords.data);
// The data will automatically have all localized fields (nameAz, descriptionAz, etc.)
// converted to their base names (name, description) with the localized values

// Get a single localized record by ID
const localizedProduct = await tableClient.getRecordById('products', 123, {
  locale: 'ru', // Get the record localized to Russian
  defaultLocale: 'en' // Fall back to English if Russian translation is not available
});

console.log('Localized product:', localizedProduct);
// The product will have all localized fields automatically converted
```

#### Working with Dynamic Tables

The TableClient is particularly useful for applications that need to work with dynamic data structures that might change over time. Here are some common use cases:

1. **Dynamic Admin Dashboards**: Build flexible admin interfaces that can adapt to changing data models
2. **Content Management Systems**: Retrieve structured content from various tables
3. **Data Visualization**: Fetch data for charts and reports from different data sources
4. **Custom Data-Driven Applications**: Work with application-specific data tables

#### Response Format

The `getRecords` method returns data in the following format:

```javascript
{
  data: [
    { id: 1, name: 'Product 1', price: 29.99, ... },
    { id: 2, name: 'Product 2', price: 49.99, ... },
    // ...
  ],
  pagination; {
    total: 157,       // Total number of records
    page;1,          // Current page
    pageSize; 20,     // Records per page
    totalPages; 8     // Total number of pages
  }
}
```

## ❌ Error Handling

All methods return promises that can throw errors. The errors include enhanced properties for better debugging:

| Property | Type | Description |
|----------|------|-------------|
| `status` | number | HTTP status code (e.g., 404, 500) |
| `statusText` | string | HTTP status text (e.g., "Not Found", "Internal Server Error") |
| `message` | string | Human-readable error message |
| `url` | string | The URL that caused the error |
| `details` | object | Additional error details if available from the API |

### Common Error Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|--------------|
| 400 | Bad Request | Invalid parameters or malformed request |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Server is temporarily unavailable |

### Example Error Handling

```javascript
try {
  const posts = await blogClient.getPosts();
  // Process posts
} catch (error) {
  // Check for specific status codes
  if (error.status === 404) {
    console.error('Resource not found');
  } else if (error.status === 429) {
    console.error('Rate limit exceeded. Please try again later.');
  } else if (error.status >= 500) {
    console.error('Server error. Please try again later.');
  } else {
    // General error handling
    console.error(`Error: ${error.message}`);

    // Log detailed information for debugging
    console.debug({
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      details: error.details
    });
  }
}
```

## 🌐 Multilingual Support

Many methods accept a `lang` parameter to retrieve content in a specific language. This is useful for applications that need to support multiple languages.

### Example Usage

```javascript
// Get blog posts in Spanish
const spanishPosts = await blogClient.getPosts({ 
  lang: 'es',
  page: 1,
  page_size: 10
});

// Get a category in French
const frenchCategory = await blogClient.getCategoryBySlug('technology', { 
  lang: 'fr' 
});

// Get a blog post in German
const germanPost = await blogClient.getPostBySlug('welcome-post', {
  lang: 'de',
  include_tags: true
});
```

## 🔄 Compatibility

### Version Requirements

| Dependency | Minimum Version |
|------------|-----------------|
| Node.js | 14.0.0 or higher |

### Browser Support

This library is compatible with any modern JavaScript environment that supports:

- Promises
- Fetch API
- ES6 features

This includes modern browsers, Node.js applications, and frameworks like React, Vue, Angular, Next.js, etc.

### TypeScript Support

Complete TypeScript definitions are included for better development experience and type safety.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/KeyTechAndDesign/dynamic-backend-client.git
   cd dynamic-backend-client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Make your changes and test them

4. Submit a pull request with a detailed description of your changes

### Code Style

Please follow the existing code style and include appropriate documentation for any new features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
