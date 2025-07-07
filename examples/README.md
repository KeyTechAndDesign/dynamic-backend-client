# Dynamic Backend Client Examples

This directory contains example code demonstrating how to use the Dynamic Backend Client library in various scenarios. These examples are designed to help you understand the library's capabilities and provide code snippets that you can adapt for your own applications.

## 🚀 Running the Examples

To run these examples, you'll need to:

1. Install the library:
   ```bash
   npm install @keytd/dynamic-backend-client
   ```

2. Update the API URL in each example to point to your actual API endpoint.

3. Run an example using Node.js:
   ```bash
   # You may need to use a transpiler like Babel for ES module support
   npx babel-node examples/basic-usage.js
   ```

## 📋 Available Examples

### [Basic Usage](./basic-usage.js)

Demonstrates how to set up the client and make basic requests. This is a good starting point if you're new to the library.

**Key concepts covered:**
- Creating the API client
- Creating specialized clients (BlogClient, TableClient)
- Making simple requests
- Basic error handling

### [Blog Operations](./blog-operations.js)

Shows how to work with blog-related content such as posts, categories, tags, and comments.

**Key concepts covered:**
- Getting blog posts with pagination and filtering
- Retrieving a specific post with comments
- Working with categories and tags
- Displaying formatted content

### [Table Operations](./table-operations.js)

Demonstrates how to work with dynamic tables, including querying, filtering, and displaying data.

**Key concepts covered:**
- Listing available tables
- Getting table structure and metadata
- Querying records with filtering and pagination
- Retrieving specific records by ID
- Working with multiple tables (manual joins)

### [Advanced Features](./advanced-features.js)

Showcases advanced features like comprehensive error handling, multilingual support, and multi-tenant capabilities.

**Key concepts covered:**
- Detailed error handling for different scenarios
- Working with multilingual content
- Multi-tenant support using different schemas
- Combining multiple operations for dashboard scenarios
- Using Promise.all for parallel requests

## 🔧 Customizing the Examples

Feel free to modify these examples to match your specific use case:

- Change the API endpoint to your actual backend URL
- Modify the query parameters to match your data structure
- Adjust the error handling to fit your application's needs
- Add authentication if your API requires it

## 📚 Additional Resources

For more information, refer to:

- [Library Documentation](../README.md)
- [API Reference](../README.md#-api-reference)
- [Error Handling Guide](../README.md#-error-handling)