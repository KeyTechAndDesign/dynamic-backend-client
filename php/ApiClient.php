<?php
namespace KeyTD\DynamicBackendClient;

/**
 * Base API client for the Dynamic Backend (PHP version)
 * - Supports GET requests only
 * - Optional in-memory caching
 */
class ApiClient
{
    private string $baseUrl;
    private string $schema;
    private int $timeout;
    private bool $enableCache;
    private int $cacheMaxAge;
    /** @var array<string, array{expires:int, value:mixed}> */
    private array $cache = [];

    /**
     * @param array{baseUrl:string, schema?:string, timeout?:int, enableCache?:bool, cacheMaxAge?:int} $config
     */
    public function __construct(array $config)
    {
        if (empty($config['baseUrl'])) {
            throw new \InvalidArgumentException('baseUrl is required');
        }

        $this->baseUrl = rtrim($config['baseUrl'], '/');
        $this->schema = $config['schema'] ?? 'public';
        $this->timeout = $config['timeout'] ?? 30000; // ms
        $this->enableCache = $config['enableCache'] ?? false;
        $this->cacheMaxAge = $config['cacheMaxAge'] ?? (5 * 60 * 1000); // ms
    }

    public function setSchema(string $schema): void
    {
        $this->schema = $schema;
    }

    public function clearCache(?string $endpoint = null): void
    {
        if ($endpoint === null) {
            $this->cache = [];
            return;
        }
        $prefix = $endpoint;
        foreach (array_keys($this->cache) as $key) {
            $decoded = json_decode($key, true);
            if (is_array($decoded) && isset($decoded['url']) && str_starts_with($decoded['url'], $prefix)) {
                unset($this->cache[$key]);
            }
        }
    }

    /**
     * Perform a GET request
     * @param string $path
     * @param array<string, scalar> $params
     * @return mixed
     */
    public function get(string $path, array $params = [])
    {
        $url = $this->buildUrl($path, $params);

        $cacheKey = json_encode(['method' => 'GET', 'url' => $url]);
        if ($this->enableCache && isset($this->cache[$cacheKey])) {
            $entry = $this->cache[$cacheKey];
            if ($entry['expires'] > (int) (microtime(true) * 1000)) {
                return $entry['value'];
            }
            unset($this->cache[$cacheKey]);
        }

        $ch = curl_init($url);
        $headers = $this->createHeaders();
        $headerLines = [];
        foreach ($headers as $k => $v) {
            $headerLines[] = $k . ': ' . $v;
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTPHEADER => $headerLines,
            CURLOPT_TIMEOUT_MS => $this->timeout,
            CURLOPT_CONNECTTIMEOUT_MS => $this->timeout,
        ]);

        $body = curl_exec($ch);
        $errno = curl_errno($ch);
        $error = curl_error($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errno) {
            throw new \RuntimeException('Network error: ' . $error, $errno);
        }

        $data = null;
        if ($body !== false && $body !== '') {
            $data = json_decode($body, true);
        }

        if ($status < 200 || $status >= 300) {
            $this->handleError($status, $url, $data);
        }

        if ($this->enableCache) {
            $this->cache[$cacheKey] = [
                'expires' => (int) (microtime(true) * 1000) + $this->cacheMaxAge,
                'value' => $data
            ];
        }

        return $data;
    }

    /**
     * @param string $path
     * @param array<string, scalar> $params
     */
    private function buildUrl(string $path, array $params = []): string
    {
        $url = $this->baseUrl . '/' . ltrim($path, '/');
        if (!empty($params)) {
            $url .= (str_contains($url, '?') ? '&' : '?') . http_build_query($params);
        }
        return $url;
    }

    /**
     * @return array<string, string>
     */
    private function createHeaders(array $additional = []): array
    {
        return array_merge([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'X-Schema' => $this->schema,
        ], $additional);
    }

    /**
     * @param int $status
     * @param string $url
     * @param mixed $details
     */
    private function handleError(int $status, string $url, $details): void
    {
        $message = 'An error occurred';
        switch ($status) {
            case 400: $message = 'Bad request: The server could not understand the request'; break;
            case 401: $message = 'Unauthorized: Authentication is required'; break;
            case 403: $message = 'Forbidden: You do not have permission to access this resource'; break;
            case 404: $message = 'Not found: The requested resource does not exist'; break;
            case 408: $message = 'Request timeout: The server timed out waiting for the request'; break;
            case 429: $message = 'Too many requests: Rate limit exceeded'; break;
            default:
                if ($status >= 500) {
                    $message = 'Server error: An internal server error occurred';
                }
        }

        $error = new \RuntimeException($message . " (HTTP $status) URL: $url");
        // Attach extra info if available
        if (is_array($details)) {
            // No typed properties for dynamic attachment; wrap into exception message JSON
            $error = new \RuntimeException($message . " (HTTP $status) URL: $url Details: " . json_encode($details));
        }
        throw $error;
    }
}

?>
