<?php
declare(strict_types=1);

/**
 * CAVXX AppleCMS proxy
 * Deploy this file as https://api.7e5zbdgbh4rebo1.sbs/api.php
 */

const UPSTREAM_API = 'https://api.heiapi.cc/api.php/provide/vod/';
const CACHE_TTL = 30;
const CONNECT_TIMEOUT = 5;
const REQUEST_TIMEOUT = 15;

$allowedOrigins = [
    'https://cavxx.pages.dev',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Allow: GET, OPTIONS');
    echo json_encode(['code' => 405, 'msg' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);
    echo json_encode(['code' => 403, 'msg' => 'Origin not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$allowedParams = ['ac', 'pg', 'pagesize', 't', 'wd', 'ids', 'sort'];
$params = [];
foreach ($allowedParams as $key) {
    if (!isset($_GET[$key]) || is_array($_GET[$key])) {
        continue;
    }
    $value = trim((string) $_GET[$key]);
    if ($value === '') {
        continue;
    }
    if (strlen($value) > 500) {
        http_response_code(400);
        echo json_encode(['code' => 400, 'msg' => 'Invalid parameter'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $params[$key] = $value;
}
if (!isset($params['ac']) || !in_array($params['ac'], ['list', 'detail'], true)) {
    http_response_code(400);
    echo json_encode(['code' => 400, 'msg' => 'Unsupported or missing ac parameter'], JSON_UNESCAPED_UNICODE);
    exit;
}

$query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
$cacheKey = hash('sha256', $query);
$cacheDir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'cavxx-api-cache';
$cacheFile = $cacheDir . DIRECTORY_SEPARATOR . $cacheKey . '.json';

if (CACHE_TTL > 0 && is_file($cacheFile) && (time() - (int) filemtime($cacheFile) < CACHE_TTL)) {
    header('X-Proxy-Cache: HIT');
    readfile($cacheFile);
    exit;
}

$url = UPSTREAM_API . ($query !== '' ? '?' . $query : '');
if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['code' => 500, 'msg' => 'PHP cURL extension is required'], JSON_UNESCAPED_UNICODE);
    exit;
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => CONNECT_TIMEOUT,
    CURLOPT_TIMEOUT => REQUEST_TIMEOUT,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => ['Accept: application/json, text/plain, */*'],
    CURLOPT_USERAGENT => 'CAVXX-PHP-Proxy/1.0',
]);
$body = curl_exec($ch);
$curlError = curl_error($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($body === false || $status < 200 || $status >= 300) {
    http_response_code(502);
    echo json_encode([
        'code' => 502,
        'msg' => 'Upstream API request failed',
        'upstream_status' => $status,
        'detail' => $curlError !== '' ? $curlError : null,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$json = json_decode($body, true);
if (!is_array($json)) {
    http_response_code(502);
    echo json_encode(['code' => 502, 'msg' => 'Upstream returned invalid JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (CACHE_TTL > 0) {
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0755, true);
    }
    if (is_dir($cacheDir) && is_writable($cacheDir)) {
        @file_put_contents($cacheFile, $body, LOCK_EX);
    }
}
if ($contentType !== '') {
    header('X-Upstream-Content-Type: ' . preg_replace('/[^a-zA-Z0-9;=\/ .+-]/', '', $contentType));
}
header('X-Proxy-Cache: MISS');
echo $body;
