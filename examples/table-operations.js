// Table Operations Example for Dynamic Backend Client
// This example demonstrates how to work with dynamic tables

// Import the client classes
import { ApiClient, TableClient } from '@keytd/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  schema: 'public'
});

// Create the table client
const tableClient = new TableClient(apiClient);

// Example: Get all available tables in the schema
async function listAllTables() {
  try {
    const tables = await tableClient.getTables();
    
    console.log('Available tables:');
    tables.forEach(table => {
      console.log(`- ${table}`);
    });
    
    return tables;
  } catch (error) {
    console.error('Error listing tables:', error.message);
  }
}

// Example: Get table structure and metadata
async function getTableStructure(tableName) {
  try {
    const tableInfo = await tableClient.getTableInfo(tableName);
    
    console.log(`Table: ${tableInfo.name}`);
    
    // Display column information
    console.log('Columns:');
    tableInfo.columns.forEach(column => {
      const constraints = [];
      if (column.primary) constraints.push('PRIMARY KEY');
      if (!column.nullable) constraints.push('NOT NULL');
      
      console.log(`- ${column.name} (${column.type})${constraints.length > 0 ? ' ' + constraints.join(', ') : ''}`);
    });
    
    // Display indexes if available
    if (tableInfo.indexes && tableInfo.indexes.length > 0) {
      console.log('\nIndexes:');
      tableInfo.indexes.forEach(index => {
        console.log(`- ${index.name}: ${index.columns.join(', ')}`);
      });
    }
    
    return tableInfo;
  } catch (error) {
    console.error(`Error getting structure for table "${tableName}":`, error.message);
  }
}

// Example: Query records with filtering and pagination
async function queryRecords(tableName) {
  try {
    // Get active products in the electronics category, sorted by price
    const records = await tableClient.getRecords(tableName, {
      page: 1,
      pageSize: 5,
      filter: {
        status: 'active',
        category: 'electronics',
        sort: 'price:asc'
      }
    });
    
    console.log(`Query results for ${tableName}:`);
    console.log(`Total records: ${records.pagination.total}`);
    console.log(`Page ${records.pagination.page} of ${records.pagination.totalPages}`);
    
    // Display the records in a table format
    console.log('\nResults:');
    
    // Get all property names from the first record
    if (records.data.length > 0) {
      const properties = Object.keys(records.data[0]);
      
      // Print header
      console.log(properties.join('\t'));
      console.log(properties.map(() => '--------').join('\t'));
      
      // Print each record
      records.data.forEach(record => {
        console.log(properties.map(prop => record[prop]).join('\t'));
      });
    } else {
      console.log('No records found matching the criteria.');
    }
    
    return records;
  } catch (error) {
    console.error(`Error querying records from "${tableName}":`, error.message);
  }
}

// Example: Get a specific record by ID
async function getRecordById(tableName, recordId) {
  try {
    const record = await tableClient.getRecordById(tableName, recordId);
    
    console.log(`Record #${recordId} from ${tableName}:`);
    
    // Display all properties of the record
    Object.entries(record).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    
    return record;
  } catch (error) {
    if (error.status === 404) {
      console.error(`Record #${recordId} not found in table "${tableName}"`);
    } else {
      console.error(`Error fetching record:`, error.message);
    }
  }
}

// Example: Working with multiple tables in a single operation
async function joinTablesManually() {
  try {
    // Get products
    const products = await tableClient.getRecords('products', {
      page: 1,
      pageSize: 10,
      filter: { status: 'active' }
    });
    
    // For each product, get its category details
    console.log('Products with category details:');
    
    for (const product of products.data) {
      // Get the category for this product
      const category = await tableClient.getRecordById('categories', product.category_id);
      
      console.log(`- ${product.name} (${product.price})`);
      console.log(`  Category: ${category.name}`);
      console.log(`  Description: ${category.description}`);
    }
    
    return products;
  } catch (error) {
    console.error('Error in join operation:', error.message);
  }
}

// Run the examples
(async () => {
  console.log('Starting table operations examples...');
  
  await listAllTables();
  console.log('\n---\n');
  
  await getTableStructure('products');
  console.log('\n---\n');
  
  await queryRecords('products');
  console.log('\n---\n');
  
  await getRecordById('products', 123);
  console.log('\n---\n');
  
  await joinTablesManually();
  
  console.log('\nTable operations examples completed!');
})();