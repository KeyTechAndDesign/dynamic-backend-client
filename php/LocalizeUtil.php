<?php
namespace KeyTD\DynamicBackendClient;

class LocalizeUtil
{
    /**
     * Get a localized field value from a structure like ["en" => "Title", "az" => "Basliq"].
     * Falls back to default locale or first available value.
     *
     * @param mixed $field
     * @param string $locale
     * @param string $defaultLocale
     * @return mixed
     */
    public static function getLocalizedField($field, string $locale, string $defaultLocale = 'en')
    {
        if (!is_array($field)) {
            return $field;
        }

        if (array_key_exists($locale, $field)) {
            return $field[$locale];
        }

        if (array_key_exists($defaultLocale, $field)) {
            return $field[$defaultLocale];
        }

        // return first value
        foreach ($field as $value) {
            return $value;
        }

        return null;
    }

    /**
     * Recursively localize all fields that look like localized objects.
     * A field is considered localizable if it is an associative array with string keys of likely locales.
     *
     * @param mixed $obj
     * @param string $locale
     * @param string $defaultLocale
     * @return mixed
     */
    public static function localizeObject($obj, string $locale, string $defaultLocale = 'en')
    {
        if (is_array($obj)) {
            // Detect associative array with possible locales
            if (self::isAssoc($obj) && self::looksLikeLocales(array_keys($obj))) {
                return self::getLocalizedField($obj, $locale, $defaultLocale);
            }

            $result = [];
            foreach ($obj as $key => $value) {
                $result[$key] = self::localizeObject($value, $locale, $defaultLocale);
            }
            return $result;
        }
        return $obj;
    }

    private static function isAssoc(array $arr): bool
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    /**
     * @param array<int, string> $keys
     */
    private static function looksLikeLocales(array $keys): bool
    {
        foreach ($keys as $k) {
            if (!is_string($k)) return false;
            if (!preg_match('/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/', $k)) {
                return false;
            }
        }
        return count($keys) > 0;
    }
}

?>
