/**
 * Table client for the Dynamic Backend
 * Handles dynamic table operations
 */

class TableClient {
  /**
   * Create a new table client
   * @param {Object} apiClient - Instance of ApiClient
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = '/api';
  }

  /**
   * Get a list of all tables in the current schema
   * @returns {Promise<Array<string>>} List of table names
   */
  async getTables() {
    return this.apiClient.get(`${this.basePath}/tables`);
  }

  /**
   * Get metadata about a specific table
   * @param {string} tableName - Name of the table
   * @returns {Promise<Object>} Table metadata
   */
  async getTableInfo(tableName) {
    return this.apiClient.get(`${this.basePath}/tables/${tableName}/info`);
  }

  /**
   * Get all records from a table with pagination and filtering
   * @param {string} tableName - Name of the table
   * @param {Object} [options={}] - Options for the request
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.pageSize=10] - Page size
   * @param {Object} [options.filter={}] - Filter criteria (field-value pairs)
   * @returns {Promise<Object>} Records with pagination info
   */
  async getRecords(tableName, options = {}) {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const filter = options.filter || {};

    // Combine pagination and filter parameters
    const params = {
      page,
      pageSize,
      ...filter
    };

    return this.apiClient.get(`${this.basePath}/tables/${tableName}`, params);
  }

  /**
   * Get a single record by ID
   * @param {string} tableName - Name of the table
   * @param {number|string} id - ID of the record
   * @returns {Promise<Object>} Record data
   */
  async getRecordById(tableName, id) {
    return this.apiClient.get(`${this.basePath}/tables/${tableName}/${id}`);
  }



}

export default TableClient;
