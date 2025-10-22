<?php
require_once __DIR__ . '/../config/config.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = getJsonInput();

    if (!isset($input['email']) || empty($input['email'])) {
        sendResponse(['error' => 'Email is required'], 400);
    }

    if (!isset($input['name']) || empty($input['name'])) {
        sendResponse(['error' => 'Name is required'], 400);
    }

    if (!isset($input['contact']) || empty($input['contact'])) {
        sendResponse(['error' => 'Contact info is required'], 400);
    }

    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);

    if (!$email) {
        sendResponse(['error' => 'Invalid email format'], 400);
    }

    // Read existing users
    $users = readJsonFile(USERS_FILE);

    // Check if user exists
    $existingUser = null;
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            $existingUser = $user;
            break;
        }
    }

    // If user doesn't exist, create new user
    if (!$existingUser) {
        $newUser = [
            'id' => uniqid('user_', true),
            'email' => $email,
            'name' => $input['name'],
            'contact' => $input['contact'],
            'createdAt' => date('Y-m-d H:i:s'),
            'lastLogin' => date('Y-m-d H:i:s')
        ];

        $users[] = $newUser;
        writeJsonFile(USERS_FILE, $users);

        sendResponse([
            'success' => true,
            'message' => 'Account created successfully',
            'user' => $newUser,
            'isNewUser' => true
        ], 201);
    } else {
        // Update last login and user info
        foreach ($users as &$user) {
            if ($user['email'] === $email) {
                $user['lastLogin'] = date('Y-m-d H:i:s');
                $user['name'] = $input['name'];
                $user['contact'] = $input['contact'];
                $existingUser = $user;
                break;
            }
        }
        writeJsonFile(USERS_FILE, $users);

        sendResponse([
            'success' => true,
            'message' => 'Login successful',
            'user' => $existingUser,
            'isNewUser' => false
        ]);
    }
} else {
    sendResponse(['error' => 'Method not allowed'], 405);
}
