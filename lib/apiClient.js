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
  }

  /**
   * Set the schema for multi-tenant support
   * @param {string} schema - Schema name
   */
  setSchema(schema) {
    this.schema = schema;
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
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, params = {}, headers = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this._request(url, {
      method: 'GET',
      headers: this._createHeaders(headers)
    });
  }

}

export default ApiClient;
