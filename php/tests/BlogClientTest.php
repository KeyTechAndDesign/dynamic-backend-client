<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use KeyTD\DynamicBackendClient\ApiClient;
use KeyTD\DynamicBackendClient\BlogClient;

final class BlogClientTest extends TestCase
{
    private DummyApiClient $api;
    private BlogClient $client;

    protected function setUp(): void
    {
        $this->api = new DummyApiClient(['baseUrl' => 'https://example.test']);
        $this->client = new BlogClient($this->api, ['basePath' => '/api']);
    }

    public function testGetCategoriesPassesLang(): void
    {
        $this->api->setNextResponse([]);
        $this->client->getCategories(['lang' => 'en']);
        $this->assertSame('/api/blog/categories', $this->api->lastPath);
        $this->assertSame(['lang' => 'en'], $this->api->lastParams);
    }

    public function testGetPostBySlugIncludesOptions(): void
    {
        $this->api->setNextResponse([]);
        $this->client->getPostBySlug('hello-world', [
            'include_tags' => true,
            'include_comments' => true,
            'lang' => 'az',
        ]);
        $this->assertSame('/api/blog/posts/slug/hello-world', $this->api->lastPath);
        $this->assertSame([
            'include_tags' => true,
            'include_comments' => true,
            'lang' => 'az',
        ], $this->api->lastParams);
    }

    public function testGetPostsMapsPaginationAndFilters(): void
    {
        $this->api->setNextResponse(['data' => [], 'pagination' => ['page' => 2]]);
        $this->client->getPosts([
            'page' => 2,
            'page_size' => 25,
            'category_id' => 3,
            'tag_id' => 5,
            'status' => 'published',
            'include_tags' => true,
            'lang' => 'ru'
        ]);
        $this->assertSame('/api/blog/posts', $this->api->lastPath);
        $this->assertSame([
            'page' => 2,
            'page_size' => 25,
            'category_id' => 3,
            'tag_id' => 5,
            'status' => 'published',
            'include_tags' => true,
            'lang' => 'ru'
        ], $this->api->lastParams);
    }

    public function testCommentsEndpoints(): void
    {
        // getCommentsByPostId should default status=approved
        $this->api->setNextResponse([]);
        $this->client->getCommentsByPostId(123, []);
        $this->assertSame('/api/blog/comments/post/123', $this->api->lastPath);
        $this->assertSame(['status' => 'approved'], $this->api->lastParams);

        // getCommentById should include lang when provided
        $this->api->setNextResponse([]);
        $this->client->getCommentById(456, ['lang' => 'en']);
        $this->assertSame('/api/blog/comments/456', $this->api->lastPath);
        $this->assertSame(['lang' => 'en'], $this->api->lastParams);
    }
}

/**
 * Dummy ApiClient that records last call and returns a preset response, avoiding network.
 */
final class DummyApiClient extends ApiClient
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
