<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use KeyTD\DynamicBackendClient\LocalizeUtil;

final class LocalizeUtilTest extends TestCase
{
    public function testGetLocalizedFieldPrefersRequestedLocale(): void
    {
        $field = ['en' => 'Title', 'az' => 'Basliq'];
        $this->assertSame('Basliq', LocalizeUtil::getLocalizedField($field, 'az', 'en'));
    }

    public function testGetLocalizedFieldFallsBackToDefault(): void
    {
        $field = ['en' => 'Title'];
        $this->assertSame('Title', LocalizeUtil::getLocalizedField($field, 'ru', 'en'));
    }

    public function testGetLocalizedFieldFallsBackToFirstValue(): void
    {
        $field = ['de' => 'Titel'];
        $this->assertSame('Titel', LocalizeUtil::getLocalizedField($field, 'ru', 'en'));
    }

    public function testLocalizeObjectRecurses(): void
    {
        $obj = [
            'title' => ['en' => 'Hello', 'ru' => 'Privet'],
            'nested' => [
                'desc' => ['en' => 'World', 'ru' => 'Mir']
            ],
            'plain' => 123
        ];

        $result = LocalizeUtil::localizeObject($obj, 'ru', 'en');
        $this->assertSame('Privet', $result['title']);
        $this->assertSame('Mir', $result['nested']['desc']);
        $this->assertSame(123, $result['plain']);
    }
}
