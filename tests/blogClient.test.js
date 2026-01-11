// Unit tests for BlogClient

import BlogClient from '../lib/blogClient';

// Create a mock ApiClient
const mockApiClient = {
  get: jest.fn()
};

describe('BlogClient', () => {
  let blogClient;
  
  beforeEach(() => {
    // Reset mocks before each test
    mockApiClient.get.mockReset();
    
    // Create a new BlogClient instance
    blogClient = new BlogClient(mockApiClient);
  });
  
  describe('constructor', () => {
    test('should create an instance with default basePath', () => {
      expect(blogClient.apiClient).toBe(mockApiClient);
      expect(blogClient.basePath).toBe('/api');
    });
    
    test('should create an instance with custom basePath', () => {
      const client = new BlogClient(mockApiClient, { basePath: '/custom-api' });
      expect(client.apiClient).toBe(mockApiClient);
      expect(client.basePath).toBe('/custom-api');
    });
    
    test('should throw an error if apiClient is not provided', () => {
      expect(() => new BlogClient()).toThrow('ApiClient instance is required');
    });
  });
  
  // Test Categories methods
  describe('Categories methods', () => {
    test('getCategories should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ]);
      
      // Call the method
      const result = await blogClient.getCategories({ lang: 'en' });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/categories',
        { lang: 'en' }
      );
      
      // Check the result
      expect(result).toEqual([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ]);
    });
    
    test('getCategoryById should throw an error if id is not provided', async () => {
      await expect(blogClient.getCategoryById()).rejects.toThrow('Category ID is required');
      await expect(blogClient.getCategoryById(null)).rejects.toThrow('Category ID is required');
    });
    
    test('getCategoryById should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({ id: 1, name: 'Category 1' });
      
      // Call the method
      const result = await blogClient.getCategoryById(1, { lang: 'en' });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/categories/1',
        { lang: 'en' }
      );
      
      // Check the result
      expect(result).toEqual({ id: 1, name: 'Category 1' });
    });
    
    test('getCategoryBySlug should throw an error if slug is not provided', async () => {
      await expect(blogClient.getCategoryBySlug()).rejects.toThrow('Category slug is required');
      await expect(blogClient.getCategoryBySlug('')).rejects.toThrow('Category slug is required');
    });
    
    test('getCategoryBySlug should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({ id: 1, name: 'Category 1', slug: 'category-1' });
      
      // Call the method
      const result = await blogClient.getCategoryBySlug('category-1', { lang: 'en' });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/categories/slug/category-1',
        { lang: 'en' }
      );
      
      // Check the result
      expect(result).toEqual({ id: 1, name: 'Category 1', slug: 'category-1' });
    });
  });
  
  // Test Tags methods
  describe('Tags methods', () => {
    test('getTags should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce([
        { id: 1, name: 'Tag 1' },
        { id: 2, name: 'Tag 2' }
      ]);
      
      // Call the method
      const result = await blogClient.getTags({ lang: 'en' });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/tags',
        { lang: 'en' }
      );
      
      // Check the result
      expect(result).toEqual([
        { id: 1, name: 'Tag 1' },
        { id: 2, name: 'Tag 2' }
      ]);
    });
    
    // Similar tests for getTagById and getTagBySlug...
  });
  
  // Test Posts methods
  describe('Posts methods', () => {
    test('getPosts should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' }
        ],
        pagination: {
          total: 2,
          page: 1,
          page_size: 10,
          total_pages: 1
        }
      });
      
      // Call the method with various options
      const result = await blogClient.getPosts({
        page: 2,
        page_size: 20,
        category_id: 5,
        tag_id: 10,
        status: 'published',
        include_tags: true,
        lang: 'en'
      });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/posts',
        {
          page: 2,
          page_size: 20,
          category_id: 5,
          tag_id: 10,
          status: 'published',
          include_tags: true,
          lang: 'en'
        }
      );
      
      // Check the result
      expect(result).toEqual({
        data: [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' }
        ],
        pagination: {
          total: 2,
          page: 1,
          page_size: 10,
          total_pages: 1
        }
      });
    });
    
    test('getPostById should throw an error if id is not provided', async () => {
      await expect(blogClient.getPostById()).rejects.toThrow('Post ID is required');
      await expect(blogClient.getPostById(null)).rejects.toThrow('Post ID is required');
    });
    
    test('getPostById should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce({ id: 1, title: 'Post 1' });
      
      // Call the method
      const result = await blogClient.getPostById(1, {
        include_tags: true,
        include_comments: true,
        lang: 'en'
      });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/posts/1',
        {
          include_tags: true,
          include_comments: true,
          lang: 'en'
        }
      );
      
      // Check the result
      expect(result).toEqual({ id: 1, title: 'Post 1' });
    });
    
    // Similar test for getPostBySlug...
  });
  
  // Test Comments methods
  describe('Comments methods', () => {
    test('getCommentsByPostId should call apiClient.get with correct parameters', async () => {
      // Mock the API response
      mockApiClient.get.mockResolvedValueOnce([
        { id: 1, content: 'Comment 1' },
        { id: 2, content: 'Comment 2' }
      ]);
      
      // Call the method
      const result = await blogClient.getCommentsByPostId(5, {
        lang: 'en'
      });
      
      // Check that apiClient.get was called correctly
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/blog/posts/5/comments',
        {
          lang: 'en'
        }
      );
      
      // Check the result
      expect(result).toEqual([
        { id: 1, content: 'Comment 1' },
        { id: 2, content: 'Comment 2' }
      ]);
    });

    test('createComment should call apiClient.post with correct parameters', async () => {
      const commentData = {
        author_name: 'John Doe',
        author_email: 'john@example.com',
        content: 'Nice post!'
      };
      mockApiClient.post = jest.fn().mockResolvedValueOnce({ id: 1, ...commentData });
      
      const result = await blogClient.createComment(5, commentData);
      
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/blog/posts/5/comments',
        commentData
      );
      expect(result.id).toBe(1);
    });
  });

  // Test Admin API
  describe('Admin API methods', () => {
    beforeEach(() => {
      mockApiClient.post = jest.fn();
      mockApiClient.put = jest.fn();
      mockApiClient.delete = jest.fn();
    });

    test('adminGetPosts should call apiClient.get with correct parameters', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [], pagination: {} });
      await blogClient.adminGetPosts({ page: 2, page_size: 50 });
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/admin/blog/posts', { page: 2, page_size: 50 });
    });

    test('adminCreatePost should call apiClient.post', async () => {
      const postData = { title: 'New Post' };
      await blogClient.adminCreatePost(postData);
      expect(mockApiClient.post).toHaveBeenCalledWith('/api/admin/blog/posts', postData);
    });

    test('adminUpdatePost should call apiClient.put', async () => {
      const postData = { title: 'Updated' };
      await blogClient.adminUpdatePost(1, postData);
      expect(mockApiClient.put).toHaveBeenCalledWith('/api/admin/blog/posts/1', postData);
    });

    test('adminDeletePost should call apiClient.delete', async () => {
      await blogClient.adminDeletePost(1);
      expect(mockApiClient.delete).toHaveBeenCalledWith('/api/admin/blog/posts/1');
    });

    test('adminPublishPost should call apiClient.post', async () => {
      await blogClient.adminPublishPost(1);
      expect(mockApiClient.post).toHaveBeenCalledWith('/api/admin/blog/posts/1/publish');
    });

    test('adminGetCategories should call apiClient.get', async () => {
      await blogClient.adminGetCategories();
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/admin/blog/categories');
    });

    test('adminGetCommentsByPostId should call apiClient.get', async () => {
      await blogClient.adminGetCommentsByPostId(5);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/admin/blog/posts/5/comments');
    });
  });
});