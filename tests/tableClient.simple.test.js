/**
 * Simplified test for the TableClient localization feature
 * Focusing only on the getRecords method
 */

const { localizeObject } = require('../lib/localizeUtil');

// Mock ApiClient for testing
class MockApiClient {
  constructor() {
    this.responses = {
      '/api/tables/products': {
        data: [
          {
            id: 1,
            nameEn: 'Laptop',
            nameAz: 'Noutbuk',
            nameRu: 'Ноутбук',
            description_en: 'Powerful laptop for professionals',
            description_az: 'Peşəkarlar üçün güclü noutbuk',
            description_ru: 'Мощный ноутбук для профессионалов',
            price: 999.99,
            inStock: true
          }
        ],
        pagination: {
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      }
    };
  }

  async get(endpoint) {
    // Return a deep copy of the response to prevent modifications from affecting subsequent requests
    return JSON.parse(JSON.stringify(this.responses[endpoint]));
  }
}

// Simplified TableClient for testing
class TableClient {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = '/api';
  }

  async getRecords(tableName, options = {}) {
    const locale = options.locale;
    const defaultLocale = options.defaultLocale || 'en';

    console.log(`\nGetting records for table ${tableName} with locale ${locale}`);

    const response = await this.apiClient.get(`${this.basePath}/tables/${tableName}`);

    console.log('Response data before localization:');
    console.log(JSON.stringify(response.data[0], null, 2));

    // If locale is provided, localize the data
    if (locale && response.data) {
      // Localize each item in the data array
      response.data = response.data.map(item => {
        return localizeObject(item, locale, defaultLocale);
      });

      console.log(`\nResponse data after localization (locale: ${locale}):`);
      console.log(JSON.stringify(response.data[0], null, 2));
    }

    return response;
  }
}

// Create a TableClient instance with the mock ApiClient
const apiClient = new MockApiClient();
const tableClient = new TableClient(apiClient);

// Test getRecords with different locales
async function testGetRecordsLocalization() {
  // Test with English locale
  console.log('\n--- Testing English locale ---');
  const enRecords = await tableClient.getRecords('products', { locale: 'en' });
  console.log('\nFinal English records:');
  console.log(JSON.stringify(enRecords.data[0], null, 2));

  // Test with Azerbaijani locale
  console.log('\n--- Testing Azerbaijani locale ---');
  const azRecords = await tableClient.getRecords('products', { locale: 'az' });
  console.log('\nFinal Azerbaijani records:');
  console.log(JSON.stringify(azRecords.data[0], null, 2));

  // Test with Russian locale
  console.log('\n--- Testing Russian locale ---');
  const ruRecords = await tableClient.getRecords('products', { locale: 'ru' });
  console.log('\nFinal Russian records:');
  console.log(JSON.stringify(ruRecords.data[0], null, 2));
}

// Run the test
testGetRecordsLocalization().catch(error => {
  console.error('Test failed:', error);
});
