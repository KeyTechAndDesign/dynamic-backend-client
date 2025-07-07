// Basic Usage Example for Dynamic Backend Client
// This example demonstrates how to set up the client and make basic requests

// Import the client classes
import { ApiClient, BlogClient, TableClient } from '@keytd/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  schema: 'public',
  timeout: 30000 // Optional, default is 30000ms
});

// Create specialized clients
const blogClient = new BlogClient(apiClient);
const tableClient = new TableClient(apiClient);

// Example: Get all blog categories
async function getBlogCategories() {
  try {
    const categories = await blogClient.getCategories();
    console.log('Blog categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    // You can access additional error properties
    console.error('Status:', error.status);
    console.error('URL:', error.url);
  }
}

// Example: Get all tables in the schema
async function getAllTables() {
  try {
    const tables = await tableClient.getTables();
    console.log('Available tables:', tables);
    return tables;
  } catch (error) {
    console.error('Error fetching tables:', error.message);
  }
}

// Run the examples
(async () => {
  console.log('Starting examples...');
  
  await getBlogCategories();
  await getAllTables();
  
  console.log('Examples completed!');
})();