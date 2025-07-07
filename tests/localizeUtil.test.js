/**
 * Tests for the localization utility functions
 */

const { getLocalizedField, localizeObject } = require('../lib/localizeUtil');

// Test data
const testObject = {
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

// Test getLocalizedField function
console.log('Testing getLocalizedField function:');

// Test with camelCase format
const nameEn = getLocalizedField(testObject, 'name', 'en');
console.log('nameEn:', nameEn); // Should be 'Laptop'

const nameAz = getLocalizedField(testObject, 'name', 'az');
console.log('nameAz:', nameAz); // Should be 'Noutbuk'

const nameRu = getLocalizedField(testObject, 'name', 'ru');
console.log('nameRu:', nameRu); // Should be 'Ноутбук'

// Test with underscore format
const descEn = getLocalizedField(testObject, 'description', 'en');
console.log('descEn:', descEn); // Should be 'Powerful laptop for professionals'

const descAz = getLocalizedField(testObject, 'description', 'az');
console.log('descAz:', descAz); // Should be 'Peşəkarlar üçün güclü noutbuk'

const descRu = getLocalizedField(testObject, 'description', 'ru');
console.log('descRu:', descRu); // Should be 'Мощный ноутбук для профессионалов'

// Test fallback to default locale
const nameFr = getLocalizedField(testObject, 'name', 'fr', 'en');
console.log('nameFr (fallback to en):', nameFr); // Should be 'Laptop'

// Test fallback to base field
const price = getLocalizedField(testObject, 'price', 'en');
console.log('price:', price); // Should be 999.99

// Test with non-existent field
const nonExistent = getLocalizedField(testObject, 'nonExistent', 'en');
console.log('nonExistent:', nonExistent); // Should be undefined

// Test localizeObject function
console.log('\nTesting localizeObject function:');

// Localize to English
const enObject = localizeObject(testObject, 'en');
console.log('English object:', JSON.stringify(enObject, null, 2));
// Should have name: 'Laptop' and description: 'Powerful laptop for professionals'

// Localize to Azerbaijani
const azObject = localizeObject(testObject, 'az');
console.log('Azerbaijani object:', JSON.stringify(azObject, null, 2));
// Should have name: 'Noutbuk' and description: 'Peşəkarlar üçün güclü noutbuk'

// Localize to Russian
const ruObject = localizeObject(testObject, 'ru');
console.log('Russian object:', JSON.stringify(ruObject, null, 2));
// Should have name: 'Ноутбук' and description: 'Мощный ноутбук для профессионалов'

// Localize to French (should fallback to English)
const frObject = localizeObject(testObject, 'fr', 'en');
console.log('French object (fallback to en):', JSON.stringify(frObject, null, 2));
// Should have name: 'Laptop' and description: 'Powerful laptop for professionals'

console.log('\nAll tests completed!');
