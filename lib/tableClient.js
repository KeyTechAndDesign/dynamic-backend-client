/**
 * Table client for the Dynamic Backend
 * Handles dynamic table operations
 */

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
   * Get all records from a table with pagination, filtering, and ordering
   * @param {string} tableName - Name of the table
   * @param {Object} [options={}] - Options for the request
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.pageSize=10] - Page size
   * @param {Object} [options.filter={}] - Filter criteria (field-value pairs)
   * @param {string} [options.order_by] - Column name followed by optional direction (ASC or DESC). If no direction is specified, ASC is used by default.
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
    const orderBy = options.order_by;

    // Create params object with pagination parameters
    const params = {
      page,
      pageSize
    };

    // Add order_by parameter if provided
    if (orderBy) {
      params.order_by = orderBy;
    }

    // Add filter parameters, ensuring they don't override pagination
    Object.entries(filter).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'pageSize' && key !== 'order_by') {
        params[key] = value;
      }
    });

    return this.apiClient.get(`${this.basePath}/tables/${tableName}`, params);
  }

  /**
   * Get a single record by ID
   * @param {string} tableName - Name of the table
   * @param {number|string} id - ID of the record
   * @returns {Promise<Object>} Record data
   * @throws {Error} If tableName or id is not provided or the API request fails
   */
  async getRecordById(tableName, id) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    if (id === undefined || id === null) {
      throw new Error('Record ID is required');
    }

    return this.apiClient.get(`${this.basePath}/tables/${tableName}/${id}`, {});
  }
}

export default TableClient;
