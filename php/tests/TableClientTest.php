<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use KeyTD\DynamicBackendClient\ApiClient;
use KeyTD\DynamicBackendClient\TableClient;

final class TableClientTest extends TestCase
{
    private DummyApiClientForTable $api;
    private TableClient $client;

    protected function setUp(): void
    {
        $this->api = new DummyApiClientForTable(['baseUrl' => 'https://example.test']);
        $this->client = new TableClient($this->api, ['basePath' => '/api']);
    }

    public function testGetTablesPath(): void
    {
        $this->api->setNextResponse(['tables' => []]);
        $this->client->getTables();
        $this->assertSame('/api/tables', $this->api->lastPath);
        $this->assertSame([], $this->api->lastParams);
    }

    public function testGetTableInfoPath(): void
    {
        $this->api->setNextResponse(['name' => 'products']);
        $this->client->getTableInfo('products');
        $this->assertSame('/api/tables/products/info', $this->api->lastPath);
        $this->assertSame([], $this->api->lastParams);
    }

    public function testGetRecordsBuildsParamsAndLocalizes(): void
    {
        $response = [
            'data' => [
                ['title' => ['en' => 'Phone', 'ru' => 'Telefon'], 'price' => 100],
                ['title' => ['en' => 'Laptop', 'ru' => 'Noutbuk'], 'price' => 200],
            ],
            'pagination' => ['page' => 1, 'pageSize' => 2]
        ];
        $this->api->setNextResponse($response);

        $out = $this->client->getRecords('products', [
            'page' => 3,
            'pageSize' => 50,
            'filter' => ['category' => 'electronics'],
            'locale' => 'ru',
            'defaultLocale' => 'en',
        ]);

        $this->assertSame('/api/tables/products', $this->api->lastPath);
        $this->assertSame([
            'page' => 3,
            'pageSize' => 50,
            'category' => 'electronics'
        ], $this->api->lastParams);

        // Ensure localization applied to each data item
        $this->assertSame('Telefon', $out['data'][0]['title']);
        $this->assertSame('Noutbuk', $out['data'][1]['title']);
        $this->assertSame(100, $out['data'][0]['price']);
    }

    public function testGetRecordByIdLocalizes(): void
    {
        $this->api->setNextResponse(['id' => 10, 'title' => ['en' => 'Chair', 'ru' => 'Stul']]);
        $out = $this->client->getRecordById('furniture', 10, ['locale' => 'ru']);
        $this->assertSame('/api/tables/furniture/10', $this->api->lastPath);
        $this->assertSame([], $this->api->lastParams);
        $this->assertSame('Stul', $out['title']);
    }
}

final class DummyApiClientForTable extends ApiClient
{
    public string $lastPath = '';
    /** @var array<string, scalar> */
    public array $lastParams = [];
    /** @var mixed */
    private $nextResponse = null;

    /** @param array{baseUrl:string, schema?:string, timeout?:int, enableCache?:bool, cacheMaxAge?:int} $config */
    public function __construct(array $config)
    {
        parent::__construct($config);
    }

    /** @param array<string, scalar> $params */
    public function get(string $path, array $params = [])
    {
        $this->lastPath = $path;
        $this->lastParams = $params;
        return $this->nextResponse;
    }

    /** @param mixed $response */
    public function setNextResponse($response): void
    {
        $this->nextResponse = $response;
    }
}
