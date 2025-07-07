/**
 * Tests for the TableClient localization feature
 */

// For testing purposes, we'll convert the TableClient to CommonJS
// This is a simplified version of the actual TableClient class
const { localizeObject } = require('../lib/localizeUtil');

// Mock TableClient for testing
class TableClient {
  constructor(apiClient, options = {}) {
    this.apiClient = apiClient;
    this.basePath = options.basePath || '/api';
  }

  async getRecords(tableName, options = {}) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const filter = options.filter || {};
    const locale = options.locale;
    const defaultLocale = options.defaultLocale || 'en';

    // Create params object with pagination parameters
    const params = {
      page,
      pageSize
    };

    // Add filter parameters, ensuring they don't override pagination
    Object.entries(filter).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'pageSize') {
        params[key] = value;
      }
    });

    const response = await this.apiClient.get(`${this.basePath}/tables/${tableName}`, params);

    console.log(`\nDEBUG - Response before localization for locale ${locale}:`);
    console.log(JSON.stringify(response.data[0], null, 2));

    // If locale is provided, localize the data
    if (locale && response.data) {
      // Localize each item in the data array
      response.data = response.data.map(item => {
        console.log(`\nDEBUG - Item before localization:`);
        console.log(JSON.stringify(item, null, 2));

        const localizedItem = localizeObject(item, locale, defaultLocale);

        console.log(`\nDEBUG - Item after localization (locale: ${locale}):`);
        console.log(JSON.stringify(localizedItem, null, 2));

        return localizedItem;
      });
    }

    return response;
  }

  async getRecordById(tableName, id, options = {}) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    if (id === undefined || id === null) {
      throw new Error('Record ID is required');
    }

    const locale = options.locale;
    const defaultLocale = options.defaultLocale || 'en';

    const response = await this.apiClient.get(`${this.basePath}/tables/${tableName}/${id}`, {});

    // If locale is provided, localize the data
    if (locale && response) {
      return localizeObject(response, locale, defaultLocale);
    }

    return response;
  }
}

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
          },
          {
            id: 2,
            nameEn: 'Smartphone',
            nameAz: 'Smartfon',
            nameRu: 'Смартфон',
            description_en: 'Latest smartphone with advanced features',
            description_az: 'Qabaqcıl xüsusiyyətləri olan ən son smartfon',
            description_ru: 'Новейший смартфон с продвинутыми функциями',
            price: 699.99,
            inStock: true
          }
        ],
        pagination: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      },
      '/api/tables/products/1': {
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
    };
  }

  async get(endpoint) {
    return this.responses[endpoint];
  }
}

// Create a TableClient instance with the mock ApiClient
const apiClient = new MockApiClient();
const tableClient = new TableClient(apiClient);

// Test getRecords with localization
async function testGetRecordsLocalization() {
  console.log('Testing getRecords with localization:');

  // Test with English locale
  const enRecords = await tableClient.getRecords('products', { locale: 'en' });
  console.log('\nEnglish records:');
  console.log(JSON.stringify(enRecords.data[0], null, 2));

  // Test with Azerbaijani locale
  const azRecords = await tableClient.getRecords('products', { locale: 'az' });
  console.log('\nAzerbaijani records:');
  console.log(JSON.stringify(azRecords.data[0], null, 2));

  // Verify that the Azerbaijani name is correct
  if (azRecords.data[0].name === 'Noutbuk') {
    console.log('✅ Azerbaijani name is correct');
  } else {
    console.log('❌ Azerbaijani name is incorrect. Expected: Noutbuk, Got:', azRecords.data[0].name);
    // Let's debug the issue
    console.log('Original data before localization:');
    console.log(JSON.stringify(apiClient.responses['/api/tables/products'].data[0], null, 2));
  }

  // Test with Russian locale
  const ruRecords = await tableClient.getRecords('products', { locale: 'ru' });
  console.log('\nRussian records:');
  console.log(JSON.stringify(ruRecords.data[0], null, 2));

  // Test with French locale (should fall back to English)
  const frRecords = await tableClient.getRecords('products', { locale: 'fr', defaultLocale: 'en' });
  console.log('\nFrench records (fallback to English):');
  console.log(JSON.stringify(frRecords.data[0], null, 2));
}

// Test getRecordById with localization
async function testGetRecordByIdLocalization() {
  console.log('\nTesting getRecordById with localization:');

  // Test with English locale
  const enRecord = await tableClient.getRecordById('products', 1, { locale: 'en' });
  console.log('\nEnglish record:');
  console.log(JSON.stringify(enRecord, null, 2));

  // Test with Azerbaijani locale
  const azRecord = await tableClient.getRecordById('products', 1, { locale: 'az' });
  console.log('\nAzerbaijani record:');
  console.log(JSON.stringify(azRecord, null, 2));

  // Test with Russian locale
  const ruRecord = await tableClient.getRecordById('products', 1, { locale: 'ru' });
  console.log('\nRussian record:');
  console.log(JSON.stringify(ruRecord, null, 2));

  // Test with French locale (should fall back to English)
  const frRecord = await tableClient.getRecordById('products', 1, { locale: 'fr', defaultLocale: 'en' });
  console.log('\nFrench record (fallback to English):');
  console.log(JSON.stringify(frRecord, null, 2));
}

// Test localizeObject function directly
function testLocalizeObjectDirectly() {
  console.log('\nTesting localizeObject function directly:');

  const testObj = {
    id: 1,
    nameEn: 'Laptop',
    nameAz: 'Noutbuk',
    nameRu: 'Ноутбук',
    description_en: 'Powerful laptop for professionals',
    description_az: 'Peşəkarlar üçün güclü noutbuk',
    description_ru: 'Мощный ноутбук для профессионалов',
    price: 999.99,
    inStock: true
  };

  console.log('\nOriginal object:');
  console.log(JSON.stringify(testObj, null, 2));

  const enObj = localizeObject(testObj, 'en');
  console.log('\nEnglish localized object:');
  console.log(JSON.stringify(enObj, null, 2));

  const azObj = localizeObject(testObj, 'az');
  console.log('\nAzerbaijani localized object:');
  console.log(JSON.stringify(azObj, null, 2));

  const ruObj = localizeObject(testObj, 'ru');
  console.log('\nRussian localized object:');
  console.log(JSON.stringify(ruObj, null, 2));
}

// Run the tests
async function runTests() {
  try {
    // First test the localizeObject function directly
    testLocalizeObjectDirectly();

    // Then test the TableClient methods
    await testGetRecordsLocalization();
    await testGetRecordByIdLocalization();
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
