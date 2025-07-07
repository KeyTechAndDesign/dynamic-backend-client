/**
 * Table client for the Dynamic Backend
 * Handles dynamic table operations
 */
const { localizeObject } = require('./localizeUtil');

class TableClient {
  /**
   * Create a new table client
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

  /**
   * Get a list of all tables in the current schema
   * @returns {Promise<Array<string>>} List of table names
   * @throws {Error} If the API request fails
   */
  async getTables() {
    return this.apiClient.get(`${this.basePath}/tables`, {});
  }

  /**
   * Get metadata about a specific table
   * @param {string} tableName - Name of the table
   * @returns {Promise<Object>} Table metadata
   * @throws {Error} If tableName is not provided or the API request fails
   */
  async getTableInfo(tableName) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    return this.apiClient.get(`${this.basePath}/tables/${tableName}/info`, {});
  }

  /**
   * Get all records from a table with pagination and filtering
   * @param {string} tableName - Name of the table
   * @param {Object} [options={}] - Options for the request
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.pageSize=10] - Page size
   * @param {Object} [options.filter={}] - Filter criteria (field-value pairs)
   * @param {string} [options.locale] - Locale for localizing the returned data (e.g., 'en', 'az', 'ru')
   * @param {string} [options.defaultLocale='en'] - Default locale to fall back to if the requested locale is not available
   * @returns {Promise<Object>} Records with pagination info
   * @throws {Error} If tableName is not provided or the API request fails
   */
  async getRecords(tableName, options = {}) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const filter = options.filter || {};
    const locale = options.locale;
    const defaultLocale = options.defaultLocale || 'en';

    // Create params object with pagination parameters
    const params = {
      page,
      pageSize
    };

    // Add filter parameters, ensuring they don't override pagination
    Object.entries(filter).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'pageSize') {
        params[key] = value;
      }
    });

    const response = await this.apiClient.get(`${this.basePath}/tables/${tableName}`, params);

    // If locale is provided, localize the data
    if (locale && response.data) {
      // Localize each item in the data array
      response.data = response.data.map(item => localizeObject(item, locale, defaultLocale));
    }

    return response;
  }

  /**
   * Get a single record by ID
   * @param {string} tableName - Name of the table
   * @param {number|string} id - ID of the record
   * @param {Object} [options={}] - Options for the request
   * @param {string} [options.locale] - Locale for localizing the returned data (e.g., 'en', 'az', 'ru')
   * @param {string} [options.defaultLocale='en'] - Default locale to fall back to if the requested locale is not available
   * @returns {Promise<Object>} Record data
   * @throws {Error} If tableName or id is not provided or the API request fails
   */
  async getRecordById(tableName, id, options = {}) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    if (id === undefined || id === null) {
      throw new Error('Record ID is required');
    }

    const locale = options.locale;
    const defaultLocale = options.defaultLocale || 'en';

    const response = await this.apiClient.get(`${this.basePath}/tables/${tableName}/${id}`, {});

    // If locale is provided, localize the data
    if (locale && response) {
      return localizeObject(response, locale, defaultLocale);
    }

    return response;
  }
}

export default TableClient;
