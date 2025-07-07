# Dynamic Backend Client for Next.js

A JavaScript client library for interacting with the Dynamic Backend API from Next.js applications. This library provides a clean, type-documented interface for working with blog content and dynamic tables.

## Installation

```bash
# If you're using npm
npm install @your-org/dynamic-backend-client

# If you're using yarn
yarn add @your-org/dynamic-backend-client
```

## Quick Start

```javascript
import { ApiClient, BlogClient, TableClient } from '@your-org/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://your-api-url.com',
  schema: 'your_schema',
  token: 'your_auth_token', // Optional, can be set later
  onAuthError: () => {
    // Handle authentication errors (e.g., redirect to login)
    window.location.href = '/login';
  }
});

// Create specialized clients
const blogClient = new BlogClient(apiClient);
const tableClient = new TableClient(apiClient);

// Example: Fetch blog posts
async function fetchBlogPosts() {
  try {
    const posts = await blogClient.getPosts({
      page: 1,
      page_size: 10,
      status: 'published',
      include_tags: true
    });

    console.log('Posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    // Handle error appropriately
  }
}

// Example: Fetch records from a dynamic table
async function fetchTableRecords(tableName) {
  try {
    const records = await tableClient.getRecords(tableName, {
      page: 1,
      pageSize: 20,
      filter: {
        status: 'active'
      }
    });

    console.log('Records:', records);
    return records;
  } catch (error) {
    console.error(`Error fetching records from ${tableName}:`, error.message);
    // Handle error appropriately
  }
}

```

## API Reference

### ApiClient

The base client that handles authentication, error handling, and HTTP requests.

```javascript
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  schema: 'public',
  token: 'jwt_token',
  onAuthError: callback,
  timeout: 30000
});
```

#### Methods

- `setToken(token)`: Set the authentication token
- `setSchema(schema)`: Set the schema for multi-tenant support
- `get(endpoint, params, headers)`: Make a GET request
- `post(endpoint, data, headers)`: Make a POST request
- `put(endpoint, data, headers)`: Make a PUT request
- `delete(endpoint, headers)`: Make a DELETE request

### BlogClient

Client for working with blog-related content.

```javascript
const blogClient = new BlogClient(apiClient);
```

#### Categories

- `getCategories(options)`: Get all blog categories
- `getCategoryById(id, options)`: Get a category by ID
- `getCategoryBySlug(slug, options)`: Get a category by slug

#### Tags

- `getTags(options)`: Get all blog tags
- `getTagById(id, options)`: Get a tag by ID
- `getTagBySlug(slug, options)`: Get a tag by slug

#### Posts

- `getPosts(options)`: Get all blog posts with pagination and filtering
- `getPostById(id, options)`: Get a post by ID
- `getPostBySlug(slug, options)`: Get a post by slug

#### Comments

- `getCommentsByPostId(postId, options)`: Get comments for a post
- `getCommentById(id, options)`: Get a comment by ID

### TableClient

Client for working with dynamic tables.

```javascript
const tableClient = new TableClient(apiClient);
```

#### Methods

- `getTables()`: Get a list of all tables in the current schema
- `getTableInfo(tableName)`: Get metadata about a specific table
- `getRecords(tableName, options)`: Get records from a table with pagination and filtering
- `getRecordById(tableName, id)`: Get a single record by ID

## Error Handling

All methods return promises that can throw errors. The errors include:

- `status`: HTTP status code
- `statusText`: HTTP status text
- `message`: Error message
- `details`: Additional error details (if available)

Example error handling:

```javascript
try {
  const posts = await blogClient.getPosts();
  // Process posts
} catch (error) {
  if (error.status === 404) {
    console.error('Resource not found');
  } else if (error.status === 403) {
    console.error('Permission denied');
  } else {
    console.error(`Error: ${error.message}`);
  }
}
```

## Multilingual Support

Many methods accept a `lang` parameter to retrieve content in a specific language:

```javascript
// Get blog posts in Spanish
const posts = await blogClient.getPosts({ lang: 'es' });

// Get a category in French
const category = await blogClient.getCategoryBySlug('technology', { lang: 'fr' });
```

## License

MIT
