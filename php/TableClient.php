<?php
namespace KeyTD\DynamicBackendClient;

class TableClient
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

    /**
     * @return array<int, string>|mixed
     */
    public function getTables()
    {
        return $this->apiClient->get("{$this->basePath}/tables", []);
    }

    public function getTableInfo(string $tableName)
    {
        if ($tableName === '') { throw new \InvalidArgumentException('Table name is required'); }
        return $this->apiClient->get("{$this->basePath}/tables/{$tableName}/info", []);
    }

    public function getRecords(string $tableName, array $options = [])
    {
        if ($tableName === '') { throw new \InvalidArgumentException('Table name is required'); }

        $page = $options['page'] ?? 1;
        $pageSize = $options['pageSize'] ?? 10;
        $filter = $options['filter'] ?? [];
        $locale = $options['locale'] ?? null;
        $defaultLocale = $options['defaultLocale'] ?? 'en';

        $params = ['page' => $page, 'pageSize' => $pageSize];
        foreach ($filter as $k => $v) {
            if ($k !== 'page' && $k !== 'pageSize') {
                $params[$k] = $v;
            }
        }

        $response = $this->apiClient->get("{$this->basePath}/tables/{$tableName}", $params);

        if ($locale && is_array($response) && isset($response['data']) && is_array($response['data'])) {
            foreach ($response['data'] as $idx => $item) {
                $response['data'][$idx] = LocalizeUtil::localizeObject($item, $locale, $defaultLocale);
            }
        }

        return $response;
    }

    public function getRecordById(string $tableName, $id, array $options = [])
    {
        if ($tableName === '') { throw new \InvalidArgumentException('Table name is required'); }
        if ($id === null || $id === '') { throw new \InvalidArgumentException('Record ID is required'); }

        $locale = $options['locale'] ?? null;
        $defaultLocale = $options['defaultLocale'] ?? 'en';

        $response = $this->apiClient->get("{$this->basePath}/tables/{$tableName}/{$id}", []);
        if ($locale && $response !== null) {
            return LocalizeUtil::localizeObject($response, $locale, $defaultLocale);
        }
        return $response;
    }
}

?>
