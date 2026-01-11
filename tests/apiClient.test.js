// Unit tests for ApiClient

// Mock fetch to avoid actual network requests
global.fetch = jest.fn();

import ApiClient from '../lib/apiClient';

describe('ApiClient', () => {
  let apiClient;
  
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockReset();
    
    // Create a new ApiClient instance
    apiClient = new ApiClient({
      baseUrl: 'https://api.example.com',
      schema: 'test',
      timeout: 5000
    });
  });
  
  describe('constructor', () => {
    test('should create an instance with default values', () => {
      const client = new ApiClient({ baseUrl: 'https://api.example.com' });
      expect(client.baseUrl).toBe('https://api.example.com');
      expect(client.schema).toBe('public');
      expect(client.timeout).toBe(30000);
    });
    
    test('should throw an error if config is not provided', () => {
      expect(() => new ApiClient()).toThrow('Config object is required');
    });
    
    test('should throw an error if baseUrl is not provided', () => {
      expect(() => new ApiClient({})).toThrow('baseUrl is required');
    });
    
    test('should use custom values when provided', () => {
      const client = new ApiClient({
        baseUrl: 'https://custom.example.com',
        schema: 'custom',
        timeout: 10000
      });
      expect(client.baseUrl).toBe('https://custom.example.com');
      expect(client.schema).toBe('custom');
      expect(client.timeout).toBe(10000);
    });
  });
  
  describe('setSchema', () => {
    test('should update the schema', () => {
      apiClient.setSchema('new-schema');
      expect(apiClient.schema).toBe('new-schema');
    });
  });
  
  describe('_createHeaders', () => {
    test('should create headers with default values', () => {
      const headers = apiClient._createHeaders();
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Schema': 'test'
      });
    });
    
    test('should include additional headers when provided', () => {
      const headers = apiClient._createHeaders({
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      });
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Schema': 'test',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      });
    });
  });
  
  describe('get', () => {
    test('should make a GET request with the correct URL and headers', async () => {
      // Mock a successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test data' })
      });
      
      const result = await apiClient.get('/test-endpoint', { param1: 'value1', param2: 'value2' });
      
      // Check that fetch was called with the correct arguments
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint?param1=value1&param2=value2',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Schema': 'test'
          }
        })
      );
      
      // Check the result
      expect(result).toEqual({ data: 'test data' });
    });
    
    test('should handle null and undefined query parameters', async () => {
      // Mock a successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test data' })
      });
      
      await apiClient.get('/test-endpoint', { 
        param1: 'value1', 
        param2: null, 
        param3: undefined, 
        param4: 0,
        param5: false
      });
      
      // Check that fetch was called with the correct URL (only param1, param4, and param5 should be included)
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint?param1=value1&param4=0&param5=false',
        expect.anything()
      );
    });
    
    test('should handle 204 No Content responses', async () => {
      // Mock a 204 No Content response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204
      });
      
      const result = await apiClient.get('/test-endpoint');
      
      // Check that the result is null
      expect(result).toBeNull();
    });
    
    test('should handle error responses', async () => {
      // Mock a 404 Not Found response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: 'https://api.example.com/test-endpoint',
        json: async () => ({ message: 'Resource not found' })
      });
      
      // The request should throw an error
      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Resource not found');
      
      // Try again with a different error
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        url: 'https://api.example.com/test-endpoint',
        json: async () => ({ message: 'Server error occurred' })
      });
      
      // The request should throw an error
      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Server error occurred');
    });
    
    test('should handle timeout errors', async () => {
      // Mock an AbortError
      fetch.mockImplementationOnce(() => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        throw error;
      });
      
      // The request should throw a timeout error
      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Request timeout after 5000ms');
    });
  });

  describe('post', () => {
    test('should make a POST request with the correct URL, headers and body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 1 })
      });
      
      const data = { title: 'Test' };
      const result = await apiClient.post('/test-endpoint', data);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(data)
        })
      );
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('put', () => {
    test('should make a PUT request', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ updated: true })
      });
      
      const data = { title: 'Updated' };
      const result = await apiClient.put('/test-endpoint/1', data);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data)
        })
      );
      expect(result).toEqual({ updated: true });
    });
  });

  describe('delete', () => {
    test('should make a DELETE request', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204
      });
      
      const result = await apiClient.delete('/test-endpoint/1');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toBeNull();
    });
  });
});