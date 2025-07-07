/**
 * Blog client for the Dynamic Backend
 * Handles blog-related API calls (posts, categories, tags, comments)
 */

class BlogClient {
  /**
   * Create a new blog client
   * @param {Object} apiClient - Instance of ApiClient
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = '/api';
  }

  // ==================== Categories ====================

  /**
   * Get all blog categories
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Array>} List of categories
   */
  async getCategories(options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/categories`, options);
  }

  /**
   * Get a blog category by ID
   * @param {number} id - Category ID
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Category data
   */
  async getCategoryById(id, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/categories/${id}`, options);
  }

  /**
   * Get a blog category by slug
   * @param {string} slug - Category slug
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Category data
   */
  async getCategoryBySlug(slug, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/categories/slug/${slug}`, options);
  }


  // ==================== Tags ====================

  /**
   * Get all blog tags
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Array>} List of tags
   */
  async getTags(options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/tags`, options);
  }

  /**
   * Get a blog tag by ID
   * @param {number} id - Tag ID
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Tag data
   */
  async getTagById(id, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/tags/${id}`, options);
  }

  /**
   * Get a blog tag by slug
   * @param {string} slug - Tag slug
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Tag data
   */
  async getTagBySlug(slug, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/tags/slug/${slug}`, options);
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
   */
  async getPostById(id, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/posts/${id}`, options);
  }

  /**
   * Get a blog post by slug
   * @param {string} slug - Post slug
   * @param {Object} [options={}] - Options for the request
   * @param {boolean} [options.include_tags=false] - Include tags in the response
   * @param {boolean} [options.include_comments=false] - Include comments in the response
   * @param {string} [options.lang] - Language code for translations
   * @returns {Promise<Object>} Post data
   */
  async getPostBySlug(slug, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/posts/slug/${slug}`, options);
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
   */
  async getCommentById(id, options = {}) {
    return this.apiClient.get(`${this.basePath}/blog/comments/${id}`, options);
  }

}

export default BlogClient;
