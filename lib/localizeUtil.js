/**
 * Utility functions for handling localized fields in data objects
 */

/**
 * Extracts the localized value from an object based on the provided locale
 * @param {Object} obj - The object containing localized fields
 * @param {string} baseFieldName - The base name of the field without locale suffix
 * @param {string} locale - The current locale (az, en, ru)
 * @param {string} [defaultLocale='en'] - The fallback locale if the requested locale is not available
 * @returns {*} The localized value or undefined if not found
 */
const getLocalizedField = (
    obj,
    baseFieldName,
    locale,
    defaultLocale = 'en'
) => {
    if (!obj) return undefined;

    // Try to get the field with the current locale suffix (camelCase format)
    const localizedFieldName = `${baseFieldName}${locale.charAt(0).toUpperCase() + locale.slice(1)}`;
    if (obj[localizedFieldName] !== undefined) {
        return obj[localizedFieldName];
    }

    // Try to get the field with the current locale suffix (underscore format)
    const underscoreFieldName = `${baseFieldName}_${locale.toLowerCase()}`;
    if (obj[underscoreFieldName] !== undefined) {
        return obj[underscoreFieldName];
    }

    // If not found, try with the default locale (camelCase format)
    if (locale !== defaultLocale) {
        const defaultFieldName = `${baseFieldName}${defaultLocale.charAt(0).toUpperCase() + defaultLocale.slice(1)}`;
        if (obj[defaultFieldName] !== undefined) {
            return obj[defaultFieldName];
        }

        // Try with the default locale (underscore format)
        const defaultUnderscoreFieldName = `${baseFieldName}_${defaultLocale.toLowerCase()}`;
        if (obj[defaultUnderscoreFieldName] !== undefined) {
            return obj[defaultUnderscoreFieldName];
        }
    }

    // If no localized field is found, return the base field if it exists
    return obj[baseFieldName];
};

/**
 * Processes an object to replace all fields that have localized versions with their localized values
 * @param {Object} obj - The object containing localized fields
 * @param {string} locale - The current locale (az, en, ru)
 * @param {string} [defaultLocale='en'] - The fallback locale if the requested locale is not available
 * @returns {Object} A new object with localized fields
 */
const localizeObject = (
    obj,
    locale,
    defaultLocale = 'en'
) => {
    if (!obj) return {};

    // Create a new object with only the non-localized fields
    const result = {};
    const baseFieldNames = new Set();
    const localizedKeys = new Set();

    // Find all base field names by removing locale suffixes
    Object.keys(obj).forEach(key => {
        // Check if the key ends with a locale suffix (Az, En, Ru) - camelCase format
        const camelCaseMatch = key.match(/^(.+?)(Az|En|Ru)$/);
        if (camelCaseMatch) {
            baseFieldNames.add(camelCaseMatch[1]);
            localizedKeys.add(key);
            return;
        }

        // Check if the key ends with a locale suffix (_az, _en, _ru) - underscore format
        const underscoreMatch = key.match(/^(.+?)_(az|en|ru)$/);
        if (underscoreMatch) {
            baseFieldNames.add(underscoreMatch[1]);
            localizedKeys.add(key);
            return;
        }

        // If it's not a localized field, add it to the result
        result[key] = obj[key];
    });

    // Add each base field with its localized version
    baseFieldNames.forEach(baseFieldName => {
        const localizedValue = getLocalizedField(obj, baseFieldName, locale, defaultLocale);
        if (localizedValue !== undefined) {
            result[baseFieldName] = localizedValue;
        }
    });

    return result;
};

module.exports = {
    getLocalizedField,
    localizeObject
};