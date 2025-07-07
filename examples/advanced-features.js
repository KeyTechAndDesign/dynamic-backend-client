// Advanced Features Example for Dynamic Backend Client
// This example demonstrates error handling, multilingual support, and other advanced features

// Import the client classes
import { ApiClient, BlogClient, TableClient } from '@keytd/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  schema: 'public'
});

// Create specialized clients
const blogClient = new BlogClient(apiClient);
const tableClient = new TableClient(apiClient);

// Example: Comprehensive error handling
async function demonstrateErrorHandling() {
  console.log('Demonstrating error handling:');
  
  // 1. Handle 404 Not Found
  try {
    console.log('Attempting to fetch a non-existent post...');
    await blogClient.getPostBySlug('non-existent-post');
  } catch (error) {
    console.log('✓ 404 Error handled correctly:');
    console.log(`  Status: ${error.status}`);
    console.log(`  Message: ${error.message}`);
    console.log(`  URL: ${error.url}`);
  }
  
  // 2. Handle invalid input
  try {
    console.log('\nAttempting to fetch a post with null ID...');
    await blogClient.getPostById(null);
  } catch (error) {
    console.log('✓ Input validation error handled correctly:');
    console.log(`  Message: ${error.message}`);
  }
  
  // 3. Handle server error (simulated)
  try {
    console.log('\nSimulating a 500 server error...');
    // This would normally be a real API call that results in a 500 error
    const fakeResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      url: 'https://api.example.com/api/error-simulation',
      json: async () => ({ message: 'Internal server error occurred' })
    };
    await apiClient._handleError(fakeResponse);
  } catch (error) {
    console.log('✓ 500 Error handled correctly:');
    console.log(`  Status: ${error.status}`);
    console.log(`  Message: ${error.message}`);
  }
  
  console.log('\nAll error scenarios handled successfully!');
}

// Example: Multilingual content support
async function demonstrateMultilingualSupport() {
  console.log('Demonstrating multilingual support:');
  
  // Array of language codes to demonstrate with
  const languages = ['en', 'es', 'fr', 'de'];
  
  // Get the same blog post in different languages
  const slug = 'welcome-post';
  
  console.log(`Fetching post "${slug}" in multiple languages:`);
  
  for (const lang of languages) {
    try {
      const post = await blogClient.getPostBySlug(slug, { lang });
      console.log(`\n${lang.toUpperCase()} version:`);
      console.log(`  Title: ${post.title}`);
      console.log(`  Summary: ${post.summary || post.excerpt || ''}`);
    } catch (error) {
      console.log(`\n${lang.toUpperCase()} version: Not available`);
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Get categories in different languages
  console.log('\nFetching categories in multiple languages:');
  
  const categoryResults = {};
  
  for (const lang of languages) {
    try {
      const categories = await blogClient.getCategories({ lang });
      categoryResults[lang] = categories.map(cat => cat.name);
      
      console.log(`\n${lang.toUpperCase()} categories:`);
      categories.forEach(category => {
        console.log(`  - ${category.name}`);
      });
    } catch (error) {
      console.log(`\n${lang.toUpperCase()} categories: Not available`);
      console.log(`  Error: ${error.message}`);
    }
  }
  
  return { categoryResults };
}

// Example: Working with different API schemas (multi-tenant)
async function demonstrateMultiTenantSupport() {
  console.log('Demonstrating multi-tenant support:');
  
  // Array of tenant schemas to demonstrate with
  const tenants = ['public', 'tenant1', 'tenant2'];
  
  for (const tenant of tenants) {
    console.log(`\nSwitching to "${tenant}" schema:`);
    
    // Set the schema for this tenant
    apiClient.setSchema(tenant);
    
    try {
      // Get tables for this tenant
      const tables = await tableClient.getTables();
      console.log(`  Available tables: ${tables.join(', ')}`);
      
      // Get blog categories for this tenant
      const categories = await blogClient.getCategories();
      console.log(`  Blog categories: ${categories.map(c => c.name).join(', ')}`);
    } catch (error) {
      console.log(`  Error accessing tenant data: ${error.message}`);
    }
  }
}

// Example: Combining multiple operations in a dashboard scenario
async function simulateDashboardData() {
  console.log('Simulating dashboard data retrieval:');
  
  try {
    // Parallel requests for different data types
    const [recentPosts, categories, productStats] = await Promise.all([
      // Get 5 most recent blog posts
      blogClient.getPosts({ page: 1, page_size: 5, status: 'published' }),
      
      // Get all blog categories
      blogClient.getCategories(),
      
      // Get product statistics from a custom table
      tableClient.getRecords('product_stats', { 
        page: 1, 
        pageSize: 1,
        filter: { period: 'current_month' } 
      })
    ]);
    
    // Display dashboard data
    console.log('\nDashboard Data:');
    
    console.log('\n1. Recent Blog Posts:');
    recentPosts.data.forEach(post => {
      console.log(`  - ${post.title} (${post.published_at})`);
    });
    
    console.log('\n2. Blog Categories:');
    categories.forEach(category => {
      console.log(`  - ${category.name} (${category.posts_count || 0} posts)`);
    });
    
    console.log('\n3. Product Statistics:');
    if (productStats.data.length > 0) {
      const stats = productStats.data[0];
      console.log(`  - Total Products: ${stats.total_products}`);
      console.log(`  - New This Month: ${stats.new_products}`);
      console.log(`  - Top Category: ${stats.top_category}`);
    } else {
      console.log('  No product statistics available');
    }
    
    return { recentPosts, categories, productStats };
  } catch (error) {
    console.error('Error retrieving dashboard data:', error.message);
  }
}

// Run the examples
(async () => {
  console.log('Starting advanced features examples...\n');
  
  await demonstrateErrorHandling();
  console.log('\n---\n');
  
  await demonstrateMultilingualSupport();
  console.log('\n---\n');
  
  await demonstrateMultiTenantSupport();
  console.log('\n---\n');
  
  await simulateDashboardData();
  
  console.log('\nAdvanced features examples completed!');
})();