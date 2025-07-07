/**
 * Simple test for the localizeObject function
 */

const { localizeObject } = require('../lib/localizeUtil');

// Test object with localized fields
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

console.log('Original object:');
console.log(JSON.stringify(testObj, null, 2));

// Test with English locale
const enObj = localizeObject(testObj, 'en');
console.log('\nEnglish localized object:');
console.log(JSON.stringify(enObj, null, 2));

// Test with Azerbaijani locale
const azObj = localizeObject(testObj, 'az');
console.log('\nAzerbaijani localized object:');
console.log(JSON.stringify(azObj, null, 2));

// Test with Russian locale
const ruObj = localizeObject(testObj, 'ru');
console.log('\nRussian localized object:');
console.log(JSON.stringify(ruObj, null, 2));

// Test with French locale (should fall back to English)
const frObj = localizeObject(testObj, 'fr', 'en');
console.log('\nFrench localized object (fallback to English):');
console.log(JSON.stringify(frObj, null, 2));
