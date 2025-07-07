/**
 * Base API client for the Dynamic Backend
 * Handles common functionality like error handling and request formatting
 */

class ApiClient {
  /**
   * Create a new API client
   * @param {Object} config - Configuration options
   * @param {string} config.baseUrl - Base URL for the API (e.g., 'https://api.example.com')
   * @param {string} [config.schema='public'] - Schema to use for multi-tenant support
   * @param {number} [config.timeout=30000] - Request timeout in milliseconds
   * @throws {Error} If baseUrl is not provided
   */
  constructor(config) {
    if (!config) {
      throw new Error('Config object is required');
    }

    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }

    this.baseUrl = config.baseUrl;
    this.schema = config.schema || 'public';
    this.timeout = config.timeout || 30000;
    this.enableCache = config.enableCache !== undefined ? config.enableCache : false;
    this.cacheMaxAge = config.cacheMaxAge || 5 * 60 * 1000; // Default: 5 minutes
    this.cache = new Map();
  }

  /**
   * Set the schema for multi-tenant support
   * @param {string} schema - Schema name
   */
  setSchema(schema) {
    this.schema = schema;
  }

  /**
   * Clear the request cache
   * @param {string} [endpoint] - Optional specific endpoint to clear (clears all if not specified)
   */
  clearCache(endpoint) {
    if (!endpoint) {
      // Clear the entire cache
      this.cache.clear();
      return;
    }

    // Clear only cache entries for the specified endpoint
    const keysToDelete = [];

    this.cache.forEach((_, key) => {
      try {
        const keyObj = JSON.parse(key);
        if (keyObj.url.startsWith(endpoint)) {
          keysToDelete.push(key);
        }
      } catch (e) {
        // Skip invalid cache keys
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Create headers for API requests
   * @param {Object} [additionalHeaders={}] - Additional headers to include
   * @returns {Object} Headers object
   * @private
   */
  _createHeaders(additionalHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Schema': this.schema,
      ...additionalHeaders
    };
  }

  /**
   * Handle API errors
   * @param {Response} response - Fetch response object
   * @returns {Promise<never>} Throws an enhanced error object
   * @private
   */
  async _handleError(response) {
    let errorData = {
      status: response.status,
      statusText: response.statusText,
      message: 'An error occurred',
      url: response.url,
      details: null
    };

    // Handle common HTTP status codes with more specific messages
    switch (response.status) {
      case 400:
        errorData.message = 'Bad request: The server could not understand the request';
        break;
      case 401:
        errorData.message = 'Unauthorized: Authentication is required';
        break;
      case 403:
        errorData.message = 'Forbidden: You do not have permission to access this resource';
        break;
      case 404:
        errorData.message = 'Not found: The requested resource does not exist';
        break;
      case 429:
        errorData.message = 'Too many requests: Rate limit exceeded';
        break;
      case 500:
        errorData.message = 'Server error: Something went wrong on the server';
        break;
      case 503:
        errorData.message = 'Service unavailable: The server is temporarily unavailable';
        break;
    }

    try {
      // Try to parse the response body for more detailed error information
      const data = await response.json();
      errorData.message = data.message || data.error || errorData.message;
      errorData.details = data.details || data.errors || null;
    } catch (e) {
      // If we can't parse the JSON, just use the status text
      // This could happen with non-JSON responses or network errors
      if (!errorData.message || errorData.message === 'An error occurred') {
        errorData.message = response.statusText || errorData.message;
      }
    }

    const error = new Error(errorData.message);
    error.status = errorData.status;
    error.statusText = errorData.statusText;
    error.url = errorData.url;
    error.details = errorData.details;

    throw error;
  }

  /**
   * Make an API request with error handling and timeout
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   * @private
   */
  async _request(endpoint, options) {
    const url = `${this.baseUrl}${endpoint}`;

    // Add timeout to the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return this._handleError(response);
      }

      // For 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} [params={}] - Query parameters
   * @param {Object} [headers={}] - Additional headers
   * @param {Object} [options={}] - Request options
   * @param {boolean} [options.skipCache=false] - Skip cache for this request
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, params = {}, headers = {}, options = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    // Generate a cache key based on the URL and headers
    const cacheKey = JSON.stringify({
      url,
      headers: this._createHeaders(headers)
    });

    // Check if caching is enabled and not explicitly skipped for this request
    if (this.enableCache && !options.skipCache) {
      const cachedItem = this.cache.get(cacheKey);

      // Return cached response if it exists and is not expired
      if (cachedItem && Date.now() - cachedItem.timestamp < this.cacheMaxAge) {
        return cachedItem.data;
      }
    }

    // Make the request if no valid cache exists
    const response = await this._request(url, {
      method: 'GET',
      headers: this._createHeaders(headers)
    });

    // Cache the response if caching is enabled
    if (this.enableCache && !options.skipCache) {
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
    }

    return response;
  }

}

export default ApiClient;
