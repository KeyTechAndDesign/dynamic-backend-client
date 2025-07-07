/**
 * Blog client for the Dynamic Backend
 * Handles blog-related API calls (posts, categories, tags, comments)
 */

class BlogClient {
  /**
   * Create a new blog client
   * @param {Object} apiClient - Instance of ApiClient
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.basePath='/api'] - Base path for API endpoints
   * @throws {Error} If apiClient is not provided
   */
  constructor(apiClient, options = {}) {
    if (!apiClient) {
      throw new Error('ApiClient instance is required');
    }

    this.apiClient = apiClient;
    this.basePath = options.basePath || '/api';
  }

  // ==================== Categories ====================

  /**
   * Get all blog categories
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Array>} List of categories
   * @throws {Error} If the API request fails
   */
  async getCategories(options = {}) {
    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/categories`, params);
  }

  /**
   * Get a blog category by ID
   * @param {number} id - Category ID
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Category data
   * @throws {Error} If id is not provided or the API request fails
   */
  async getCategoryById(id, options = {}) {
    if (id === undefined || id === null) {
      throw new Error('Category ID is required');
    }

    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/categories/${id}`, params);
  }

  /**
   * Get a blog category by slug
   * @param {string} slug - Category slug
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Category data
   * @throws {Error} If slug is not provided or the API request fails
   */
  async getCategoryBySlug(slug, options = {}) {
    if (!slug) {
      throw new Error('Category slug is required');
    }

    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/categories/slug/${slug}`, params);
  }


  // ==================== Tags ====================

  /**
   * Get all blog tags
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Array>} List of tags
   * @throws {Error} If the API request fails
   */
  async getTags(options = {}) {
    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/tags`, params);
  }

  /**
   * Get a blog tag by ID
   * @param {number} id - Tag ID
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Tag data
   * @throws {Error} If id is not provided or the API request fails
   */
  async getTagById(id, options = {}) {
    if (id === undefined || id === null) {
      throw new Error('Tag ID is required');
    }

    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/tags/${id}`, params);
  }

  /**
   * Get a blog tag by slug
   * @param {string} slug - Tag slug
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Tag data
   * @throws {Error} If slug is not provided or the API request fails
   */
  async getTagBySlug(slug, options = {}) {
    if (!slug) {
      throw new Error('Tag slug is required');
    }

    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/tags/slug/${slug}`, params);
  }


  // ==================== Posts ====================

  /**
   * Get all blog posts with pagination and filtering
   * @param {Object} [options={}] - Options for the request
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.page_size=10] - Page size
   * @param {number} [options.category_id] - Filter by category ID
   * @param {number} [options.tag_id] - Filter by tag ID
   * @param {string} [options.status] - Filter by status (published, draft, archived)
   * @param {boolean} [options.include_tags=false] - Include tags in the response
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Posts data with pagination
   */
  async getPosts(options = {}) {
    const params = {
      page: options.page || 1,
      page_size: options.page_size || 10,
      category_id: options.category_id,
      tag_id: options.tag_id,
      status: options.status,
      include_tags: options.include_tags,
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/posts`, params);
  }

  /**
   * Get a blog post by ID
   * @param {number} id - Post ID
   * @param {Object} [options={}] - Options for the request
   * @param {boolean} [options.include_tags=false] - Include tags in the response
   * @param {boolean} [options.include_comments=false] - Include comments in the response
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Post data
   * @throws {Error} If id is not provided or the API request fails
   */
  async getPostById(id, options = {}) {
    if (id === undefined || id === null) {
      throw new Error('Post ID is required');
    }

    const params = {
      include_tags: options.include_tags,
      include_comments: options.include_comments,
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/posts/${id}`, params);
  }

  /**
   * Get a blog post by slug
   * @param {string} slug - Post slug
   * @param {Object} [options={}] - Options for the request
   * @param {boolean} [options.include_tags=false] - Include tags in the response
   * @param {boolean} [options.include_comments=false] - Include comments in the response
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Post data
   * @throws {Error} If slug is not provided or the API request fails
   */
  async getPostBySlug(slug, options = {}) {
    if (!slug) {
      throw new Error('Post slug is required');
    }

    const params = {
      include_tags: options.include_tags,
      include_comments: options.include_comments,
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/posts/slug/${slug}`, params);
  }


  // ==================== Comments ====================

  /**
   * Get comments for a blog post
   * @param {number} postId - Post ID
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.status='approved'] - Filter by status (approved, pending, spam)
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Array>} List of comments
   */
  async getCommentsByPostId(postId, options = {}) {
    const params = {
      status: options.status || 'approved',
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/comments/post/${postId}`, params);
  }

  /**
   * Get a comment by ID
   * @param {number} id - Comment ID
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Comment data
   * @throws {Error} If id is not provided or the API request fails
   */
  async getCommentById(id, options = {}) {
    if (id === undefined || id === null) {
      throw new Error('Comment ID is required');
    }

    const params = {
      lang: options.lang
    };

    return this.apiClient.get(`${this.basePath}/blog/comments/${id}`, params);
  }

}

export default BlogClient;
