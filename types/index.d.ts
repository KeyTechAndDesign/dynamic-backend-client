/**
 * Type definitions for @keytd/dynamic-backend-client
 */

declare module '@keytd/dynamic-backend-client' {
  /**
   * Configuration options for the API client
   */
  export interface ApiClientConfig {
    /**
     * Base URL for the API (e.g., 'https://api.example.com')
     */
    baseUrl: string;

    /**
     * Schema to use for multi-tenant support
     * @default 'public'
     */
    schema?: string;

    /**
     * Request timeout in milliseconds
     * @default 30000
     */
    timeout?: number;
  }

  /**
   * Base API client for the Dynamic Backend
   */
  export class ApiClient {
    /**
     * Create a new API client
     * @throws {Error} If baseUrl is not provided
     */
    constructor(config: ApiClientConfig);

    /**
     * Set the schema for multi-tenant support
     */
    setSchema(schema: string): void;

    /**
     * Make a GET request
     * @throws {Error} If the request fails
     */
    get(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<any>;

    /**
     * Make a POST request
     * @throws {Error} If the request fails
     */
    post(endpoint: string, data?: Record<string, any>, headers?: Record<string, string>): Promise<any>;

    /**
     * Make a PUT request
     * @throws {Error} If the request fails
     */
    put(endpoint: string, data?: Record<string, any>, headers?: Record<string, string>): Promise<any>;

    /**
     * Make a DELETE request
     * @throws {Error} If the request fails
     */
    delete(endpoint: string, headers?: Record<string, string>): Promise<any>;
  }

  /**
   * Blog client for the Dynamic Backend
   */
  export class BlogClient {
    /**
     * Create a new blog client
     * @throws {Error} If apiClient is not provided
     */
    constructor(apiClient: ApiClient, options?: {
      basePath?: string;
    });

    /**
     * Get all blog categories
     * @throws {Error} If the API request fails
     */
    getCategories(options?: {
      lang?: string;
    }): Promise<any[]>;

    /**
     * Get a blog category by ID
     * @throws {Error} If id is not provided or the API request fails
     */
    getCategoryById(id: number, options?: {
      lang?: string;
    }): Promise<any>;

    /**
     * Get a blog category by slug
     * @throws {Error} If slug is not provided or the API request fails
     */
    getCategoryBySlug(slug: string, options?: {
      lang?: string;
    }): Promise<any>;

    /**
     * Get all blog tags
     * @throws {Error} If the API request fails
     */
    getTags(options?: {
      lang?: string;
    }): Promise<any[]>;

    /**
     * Get a blog tag by ID
     * @throws {Error} If id is not provided or the API request fails
     */
    getTagById(id: number, options?: {
      lang?: string;
    }): Promise<any>;

    /**
     * Get a blog tag by slug
     * @throws {Error} If slug is not provided or the API request fails
     */
    getTagBySlug(slug: string, options?: {
      lang?: string;
    }): Promise<any>;

    /**
     * Get all blog posts with pagination and filtering
     * @throws {Error} If the API request fails
     */
    getPosts(options?: {
      page?: number;
      page_size?: number;
      category_id?: number;
      tag_id?: number;
      status?: string;
      include_tags?: boolean;
      lang?: string;
    }): Promise<any>;

    /**
     * Get a blog post by ID
     * @throws {Error} If id is not provided or the API request fails
     */
    getPostById(id: number, options?: {
      include_tags?: boolean;
      include_comments?: boolean;
      lang?: string;
    }): Promise<any>;

    /**
     * Get a blog post by slug
     * @throws {Error} If slug is not provided or the API request fails
     */
    getPostBySlug(slug: string, options?: {
      include_tags?: boolean;
      include_comments?: boolean;
      lang?: string;
    }): Promise<any>;

    /**
     * Get comments for a blog post
     * @throws {Error} If postId is not provided or the API request fails
     */
    getCommentsByPostId(postId: number, options?: {
      lang?: string;
    }): Promise<any[]>;

    /**
     * Submit a comment for a blog post
     * @throws {Error} If postId is not provided or the API request fails
     */
    createComment(postId: number, data: {
      author_name: string;
      author_email: string;
      content: string;
      parent_id?: number;
    }): Promise<any>;

    /**
     * Get all blog posts (Admin)
     * @throws {Error} If the API request fails
     */
    adminGetPosts(options?: {
      page?: number;
      page_size?: number;
    }): Promise<any>;

    /**
     * Create a new blog post (Admin)
     * @throws {Error} If the API request fails
     */
    adminCreatePost(data: any): Promise<any>;

    /**
     * Get a blog post by ID with all translations (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminGetPostById(id: number): Promise<any>;

    /**
     * Update a blog post (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminUpdatePost(id: number, data: any): Promise<any>;

    /**
     * Delete a blog post (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminDeletePost(id: number): Promise<any>;

    /**
     * Publish a blog post (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminPublishPost(id: number): Promise<any>;

    /**
     * Archive a blog post (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminArchivePost(id: number): Promise<any>;

    /**
     * Get all categories (Admin)
     * @throws {Error} If the API request fails
     */
    adminGetCategories(): Promise<any[]>;

    /**
     * Create a new category (Admin)
     * @throws {Error} If the API request fails
     */
    adminCreateCategory(data: any): Promise<any>;

    /**
     * Update a category (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminUpdateCategory(id: number, data: any): Promise<any>;

    /**
     * Delete a category (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminDeleteCategory(id: number): Promise<any>;

    /**
     * Get all tags (Admin)
     * @throws {Error} If the API request fails
     */
    adminGetTags(): Promise<any[]>;

    /**
     * Create a new tag (Admin)
     * @throws {Error} If the API request fails
     */
    adminCreateTag(data: any): Promise<any>;

    /**
     * Update a tag (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminUpdateTag(id: number, data: any): Promise<any>;

    /**
     * Delete a tag (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminDeleteTag(id: number): Promise<any>;

    /**
     * Get comments for a post (Admin)
     * @throws {Error} If postId is not provided or the API request fails
     */
    adminGetCommentsByPostId(postId: number): Promise<any[]>;

    /**
     * Get a comment by ID (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminGetCommentById(id: number): Promise<any>;

    /**
     * Update a comment status or content (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminUpdateComment(id: number, data: any): Promise<any>;

    /**
     * Delete a comment (Admin)
     * @throws {Error} If id is not provided or the API request fails
     */
    adminDeleteComment(id: number): Promise<any>;
  }

  /**
   * Table client for the Dynamic Backend
   */
  export class TableClient {
    /**
     * Create a new table client
     * @throws {Error} If apiClient is not provided
     */
    constructor(apiClient: ApiClient, options?: {
      basePath?: string;
    });

    /**
     * Get a list of all tables in the current schema
     * @throws {Error} If the API request fails
     */
    getTables(): Promise<string[]>;

    /**
     * Get metadata about a specific table
     * @throws {Error} If tableName is not provided or the API request fails
     */
    getTableInfo(tableName: string): Promise<any>;

    /**
     * Get all records from a table with pagination and filtering
     * @throws {Error} If tableName is not provided or the API request fails
     */
    getRecords(tableName: string, options?: {
      page?: number;
      pageSize?: number;
      filter?: Record<string, any>;
    }): Promise<any>;

    /**
     * Get a single record by ID
     * @throws {Error} If tableName or id is not provided or the API request fails
     */
    getRecordById(tableName: string, id: number | string): Promise<any>;
  }
}
