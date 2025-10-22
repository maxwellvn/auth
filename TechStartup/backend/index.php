<?php
header('Content-Type: application/json');

$apiInfo = [
    'name' => 'Angel Court Lounge API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => [
            'url' => '/api/auth.php',
            'methods' => ['POST'],
            'description' => 'Email-only authentication (creates account if not exists)',
            'body' => ['email' => 'user@example.com']
        ],
        'bookings' => [
            'url' => '/api/bookings.php',
            'methods' => ['GET', 'POST', 'PUT', 'DELETE'],
            'description' => 'Manage lounge visitation bookings',
            'GET' => 'Get bookings (optional: ?email=user@example.com or ?date=2025-01-01)',
            'POST' => 'Create booking (body: email, date, timeSlot, guestName, purpose)',
            'PUT' => 'Update booking (body: id, status, guestName, purpose)',
            'DELETE' => 'Cancel booking (query: ?id=booking_id)'
        ]
    ]
];

echo json_encode($apiInfo, JSON_PRETTY_PRINT);
