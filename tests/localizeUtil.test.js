/**
 * Tests for the localization utility functions
 */

const { getLocalizedField, localizeObject } = require('../lib/localizeUtil');

describe('localizeUtil', () => {
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

  describe('getLocalizedField', () => {
    test('should work with camelCase format (En)', () => {
      const nameEn = getLocalizedField(testObject, 'name', 'en');
      expect(nameEn).toBe('Laptop');
    });

    test('should work with camelCase format (Az)', () => {
      const nameAz = getLocalizedField(testObject, 'name', 'az');
      expect(nameAz).toBe('Noutbuk');
    });

    test('should work with underscore format (En)', () => {
      const descEn = getLocalizedField(testObject, 'description', 'en');
      expect(descEn).toBe('Powerful laptop for professionals');
    });

    test('should work with underscore format (Az)', () => {
      const descAz = getLocalizedField(testObject, 'description', 'az');
      expect(descAz).toBe('Peşəkarlar üçün güclü noutbuk');
    });

    test('should fallback to default locale', () => {
      const nameFr = getLocalizedField(testObject, 'name', 'fr', 'en');
      expect(nameFr).toBe('Laptop');
    });

    test('should fallback to base field', () => {
      const price = getLocalizedField(testObject, 'price', 'en');
      expect(price).toBe(999.99);
    });

    test('should return undefined for non-existent field', () => {
      const nonExistent = getLocalizedField(testObject, 'nonExistent', 'en');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('localizeObject', () => {
    test('should localize to English', () => {
      const enObject = localizeObject(testObject, 'en');
      expect(enObject.name).toBe('Laptop');
      expect(enObject.description).toBe('Powerful laptop for professionals');
    });

    test('should localize to Azerbaijani', () => {
      const azObject = localizeObject(testObject, 'az');
      expect(azObject.name).toBe('Noutbuk');
      expect(azObject.description).toBe('Peşəkarlar üçün güclü noutbuk');
    });

    test('should fallback when localizing', () => {
      const frObject = localizeObject(testObject, 'fr', 'en');
      expect(frObject.name).toBe('Laptop');
      expect(frObject.description).toBe('Powerful laptop for professionals');
    });
  });
});
