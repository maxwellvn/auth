<?php
// Database file paths
define('USERS_FILE', __DIR__ . '/../data/users.json');
define('BOOKINGS_FILE', __DIR__ . '/../data/bookings.json');

// CORS headers for React frontend
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helper function to read JSON file
function readJsonFile($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?? [];
}

// Helper function to write JSON file
function writeJsonFile($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Helper function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper function to get JSON input
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}
