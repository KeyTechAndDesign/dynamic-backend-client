<?php
namespace KeyTD\DynamicBackendClient;

class BlogClient
{
    private ApiClient $apiClient;
    private string $basePath;

    /**
     * @param ApiClient $apiClient
     * @param array{basePath?:string} $options
     */
    public function __construct(ApiClient $apiClient, array $options = [])
    {
        $this->apiClient = $apiClient;
        $this->basePath = $options['basePath'] ?? '/api';
    }

    // Categories
    public function getCategories(array $options = [])
    {
        $params = ['lang' => $options['lang'] ?? null];
        return $this->apiClient->get("{$this->basePath}/blog/categories", array_filter($params, fn($v) => $v !== null));
    }

    public function getCategoryById($id, array $options = [])
    {
        if ($id === null || $id === '') { throw new \InvalidArgumentException('Category ID is required'); }
        $params = ['lang' => $options['lang'] ?? null];
        return $this->apiClient->get("{$this->basePath}/blog/categories/{$id}", array_filter($params, fn($v) => $v !== null));
    }

    public function getCategoryBySlug(string $slug, array $options = [])
    {
        if ($slug === '') { throw new \InvalidArgumentException('Category slug is required'); }
        $params = ['lang' => $options['lang'] ?? null];
        return $this->apiClient->get("{$this->basePath}/blog/categories/slug/{$slug}", array_filter($params, fn($v) => $v !== null));
    }

    // Tags
    public function getTags(array $options = [])
    {
        $params = ['lang' => $options['lang'] ?? null];
        return $this->apiClient->get("{$this->basePath}/blog/tags", array_filter($params, fn($v) => $v !== null));
    }

    public function getTagById($id, array $options = [])
    {
        if ($id === null || $id === '') { throw new \InvalidArgumentException('Tag ID is required'); }
        $params = ['lang' => $options['lang'] ?? null];
        return $this->apiClient->get("{$this->basePath}/blog/tags/{$id}", array_filter($params, fn($v) => $v !== null));
    }

    public function getTagBySlug(string $slug, array $options = [])
    {
        if ($slug === '') { throw new \InvalidArgumentException('Tag slug is required'); }
        $params = ['lang' => $options['lang'] ?? null];
        return $this->apiClient->get("{$this->basePath}/blog/tags/slug/{$slug}", array_filter($params, fn($v) => $v !== null));
    }

    // Posts
    public function getPosts(array $options = [])
    {
        $params = [
            'page' => $options['page'] ?? 1,
            'page_size' => $options['page_size'] ?? 10,
            'category_id' => $options['category_id'] ?? null,
            'tag_id' => $options['tag_id'] ?? null,
            'status' => $options['status'] ?? null,
            'include_tags' => $options['include_tags'] ?? null,
            'lang' => $options['lang'] ?? null,
        ];
        $params = array_filter($params, fn($v) => $v !== null);
        return $this->apiClient->get("{$this->basePath}/blog/posts", $params);
    }

    public function getPostById($id, array $options = [])
    {
        if ($id === null || $id === '') { throw new \InvalidArgumentException('Post ID is required'); }
        $params = [
            'include_tags' => $options['include_tags'] ?? null,
            'include_comments' => $options['include_comments'] ?? null,
            'lang' => $options['lang'] ?? null,
        ];
        $params = array_filter($params, fn($v) => $v !== null);
        return $this->apiClient->get("{$this->basePath}/blog/posts/{$id}", $params);
    }

    public function getPostBySlug(string $slug, array $options = [])
    {
        if ($slug === '') { throw new \InvalidArgumentException('Post slug is required'); }
        $params = [
            'include_tags' => $options['include_tags'] ?? null,
            'include_comments' => $options['include_comments'] ?? null,
            'lang' => $options['lang'] ?? null,
        ];
        $params = array_filter($params, fn($v) => $v !== null);
        return $this->apiClient->get("{$this->basePath}/blog/posts/slug/{$slug}", $params);
    }

    public function getCommentsByPostId($postId, array $options = [])
    {
        if ($postId === null || $postId === '') { throw new \InvalidArgumentException('Post ID is required'); }
        // Match JS client: status (default 'approved') and optional lang
        $params = [
            'status' => $options['status'] ?? 'approved',
            'lang' => $options['lang'] ?? null,
        ];
        $params = array_filter($params, fn($v) => $v !== null);
        return $this->apiClient->get("{$this->basePath}/blog/comments/post/{$postId}", $params);
    }

    /**
     * Get a comment by ID
     * @param mixed $id
     * @param array{lang?:string} $options
     */
    public function getCommentById($id, array $options = [])
    {
        if ($id === null || $id === '') { throw new \InvalidArgumentException('Comment ID is required'); }
        $params = ['lang' => $options['lang'] ?? null];
        $params = array_filter($params, fn($v) => $v !== null);
        return $this->apiClient->get("{$this->basePath}/blog/comments/{$id}", $params);
    }
}

?>
