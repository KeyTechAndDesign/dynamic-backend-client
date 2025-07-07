/**
 * Base API client for the Dynamic Backend
 * Handles common functionality like authentication, error handling, and request formatting
 */

class ApiClient {
  /**
   * Create a new API client
   * @param {Object} config - Configuration options
   * @param {string} config.baseUrl - Base URL for the API (e.g., 'https://api.example.com')
   * @param {string} [config.schema='public'] - Schema to use for multi-tenant support
   * @param {string} [config.token=null] - Authentication token
   * @param {Function} [config.onAuthError=null] - Callback for authentication errors
   * @param {number} [config.timeout=30000] - Request timeout in milliseconds
   */
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.schema = config.schema || 'public';
    this.token = config.token || null;
    this.onAuthError = config.onAuthError || null;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Set the authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
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
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Schema': this.schema,
      ...additionalHeaders
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Handle API errors
   * @param {Response} response - Fetch response object
   * @returns {Promise<Object>} Error object with status and message
   * @private
   */
  async _handleError(response) {
    let errorData = {
      status: response.status,
      statusText: response.statusText,
      message: 'An error occurred'
    };

    try {
      const data = await response.json();
      errorData.message = data.message || data.error || errorData.message;
      errorData.details = data.details || null;
    } catch (e) {
      // If we can't parse the JSON, just use the status text
      errorData.message = response.statusText;
    }

    // Handle authentication errors
    if (response.status === 401 && this.onAuthError) {
      this.onAuthError(errorData);
    }

    const error = new Error(errorData.message);
    error.status = errorData.status;
    error.statusText = errorData.statusText;
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

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [headers={}] - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data, headers = {}) {
    return this._request(endpoint, {
      method: 'POST',
      headers: this._createHeaders(headers),
      body: JSON.stringify(data)
    });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [headers={}] - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data, headers = {}) {
    return this._request(endpoint, {
      method: 'PUT',
      headers: this._createHeaders(headers),
      body: JSON.stringify(data)
    });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} [headers={}] - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, headers = {}) {
    return this._request(endpoint, {
      method: 'DELETE',
      headers: this._createHeaders(headers)
    });
  }
}

export default ApiClient;