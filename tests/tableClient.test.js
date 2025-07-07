// Unit tests for TableClient

import TableClient from '../lib/tableClient';

// Create a mock ApiClient
const mockApiClient = {
  get: jest.fn()
};

describe('TableClient', () => {
  let tableClient;
  
  beforeEach(() => {
    // Reset mocks before each test
    mockApiClient.get.mockReset();
    
    // Create a new TableClient instance
    tableClient = new TableClient(mockApiClient);
  });
  
  describe('constructor', () => {
    test('should create an instance with default basePath', () => {
      expect(tableClient.apiClient).toBe(mockApiClient);
      expect(tableClient.basePath).toBe('/api');
    });
    
    test('should create an instance with custom basePath', () => {
      const client = new TableClient(mockApiClient, { basePath: '/custom-api' });
      expect(client.apiClient).toBe(mockApiClient);
      expect(client.basePath).toBe('/custom-api');
    });
    
    test('should throw an error if apiClient is not provided', () => {
      expect(() => new TableClient()).toThrow('ApiClient instance is required');
    });
  });
  
  describe('getTables', () => {
    test('should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce(['table1', 'table2', 'table3']);
      
      // Call the method
      const result = await tableClient.getTables();
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables', {});
      
      // Check the result
      expect(result).toEqual(['table1', 'table2', 'table3']);
    });
  });
  
  describe('getTableInfo', () => {
    test('should throw an error if tableName is not provided', async () => {
      await expect(tableClient.getTableInfo()).rejects.toThrow('Table name is required');
      await expect(tableClient.getTableInfo('')).rejects.toThrow('Table name is required');
    });
    
    test('should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({
        name: 'products',
        columns: [
          { name: 'id', type: 'integer', primary: true },
          { name: 'name', type: 'string', nullable: false }
        ]
      });
      
      // Call the method
      const result = await tableClient.getTableInfo('products');
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables/products/info', {});
      
      // Check the result
      expect(result).toEqual({
        name: 'products',
        columns: [
          { name: 'id', type: 'integer', primary: true },
          { name: 'name', type: 'string', nullable: false }
        ]
      });
    });
  });
  
  describe('getRecords', () => {
    test('should throw an error if tableName is not provided', async () => {
      await expect(tableClient.getRecords()).rejects.toThrow('Table name is required');
      await expect(tableClient.getRecords('')).rejects.toThrow('Table name is required');
    });
    
    test('should call apiClient.get with correct parameters and default options', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({
        data: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' }
        ],
        pagination: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      });
      
      // Call the method with no options
      const result = await tableClient.getRecords('products');
      
      // Check that apiClient.get was called correctly with default pagination
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables/products', {
        page: 1,
        pageSize: 10
      });
      
      // Check the result
      expect(result).toEqual({
        data: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' }
        ],
        pagination: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      });
    });
    
    test('should call apiClient.get with custom pagination and filter', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({
        data: [
          { id: 1, name: 'Product 1', category: 'electronics' }
        ],
        pagination: {
          total: 1,
          page: 2,
          pageSize: 5,
          totalPages: 3
        }
      });
      
      // Call the method with custom options
      const result = await tableClient.getRecords('products', {
        page: 2,
        pageSize: 5,
        filter: {
          category: 'electronics',
          status: 'active',
          price_min: 100
        }
      });
      
      // Check that apiClient.get was called correctly with pagination and filter
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables/products', {
        page: 2,
        pageSize: 5,
        category: 'electronics',
        status: 'active',
        price_min: 100
      });
      
      // Check the result
      expect(result).toEqual({
        data: [
          { id: 1, name: 'Product 1', category: 'electronics' }
        ],
        pagination: {
          total: 1,
          page: 2,
          pageSize: 5,
          totalPages: 3
        }
      });
    });
    
    test('should not allow filter to override pagination parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({ data: [], pagination: {} });
      
      // Call the method with filter that tries to override pagination
      await tableClient.getRecords('products', {
        page: 2,
        pageSize: 5,
        filter: {
          page: 3,         // This should not override the page parameter
          pageSize: 10,    // This should not override the pageSize parameter
          category: 'electronics'
        }
      });
      
      // Check that apiClient.get was called with the correct parameters
      // The page and pageSize from the options should be used, not from the filter
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables/products', {
        page: 2,
        pageSize: 5,
        category: 'electronics'
      });
    });
  });
  
  describe('getRecordById', () => {
    test('should throw an error if tableName is not provided', async () => {
      await expect(tableClient.getRecordById()).rejects.toThrow('Table name is required');
      await expect(tableClient.getRecordById('')).rejects.toThrow('Table name is required');
    });
    
    test('should throw an error if id is not provided', async () => {
      await expect(tableClient.getRecordById('products')).rejects.toThrow('Record ID is required');
      await expect(tableClient.getRecordById('products', null)).rejects.toThrow('Record ID is required');
    });
    
    test('should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({ id: 1, name: 'Product 1' });
      
      // Call the method
      const result = await tableClient.getRecordById('products', 1);
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables/products/1', {});
      
      // Check the result
      expect(result).toEqual({ id: 1, name: 'Product 1' });
    });
    
    test('should work with string IDs', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({ id: 'abc123', name: 'Product ABC' });
      
      // Call the method with a string ID
      const result = await tableClient.getRecordById('products', 'abc123');
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/tables/products/abc123', {});
      
      // Check the result
      expect(result).toEqual({ id: 'abc123', name: 'Product ABC' });
    });
  });
});