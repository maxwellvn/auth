<?php
require_once __DIR__ . '/../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - Get all bookings or user's bookings
if ($method === 'GET') {
    $bookings = readJsonFile(BOOKINGS_FILE);

    // Filter by user email if provided
    if (isset($_GET['email'])) {
        $email = $_GET['email'];
        $bookings = array_filter($bookings, function($booking) use ($email) {
            return $booking['userEmail'] === $email;
        });
    }

    // Filter by date if provided
    if (isset($_GET['date'])) {
        $date = $_GET['date'];
        $bookings = array_filter($bookings, function($booking) use ($date) {
            return $booking['date'] === $date;
        });
    }

    sendResponse([
        'success' => true,
        'bookings' => array_values($bookings)
    ]);
}

// POST - Create new booking
if ($method === 'POST') {
    $input = getJsonInput();

    // Validate required fields
    if (!isset($input['userEmail']) || !isset($input['date']) || !isset($input['timeSlot'])) {
        sendResponse(['error' => 'Email, date, and time slot are required'], 400);
    }

    $email = filter_var($input['userEmail'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        sendResponse(['error' => 'Invalid email format'], 400);
    }

    $bookings = readJsonFile(BOOKINGS_FILE);

    // Check if time slot is already booked
    $timeSlotTaken = false;
    foreach ($bookings as $booking) {
        if ($booking['date'] === $input['date'] &&
            $booking['timeSlot'] === $input['timeSlot'] &&
            $booking['status'] !== 'cancelled') {
            $timeSlotTaken = true;
            break;
        }
    }

    if ($timeSlotTaken) {
        sendResponse(['error' => 'This time slot is already booked'], 409);
    }

    // Create new booking
    $newBooking = [
        'id' => uniqid('booking_', true),
        'userEmail' => $email,
        'date' => $input['date'],
        'timeSlot' => $input['timeSlot'],
        'guestName' => $input['guestName'] ?? '',
        'purpose' => $input['purpose'] ?? '',
        'status' => 'confirmed',
        'createdAt' => date('Y-m-d H:i:s')
    ];

    $bookings[] = $newBooking;
    writeJsonFile(BOOKINGS_FILE, $bookings);

    sendResponse([
        'success' => true,
        'message' => 'Booking created successfully',
        'booking' => $newBooking
    ], 201);
}

// PUT - Update booking
if ($method === 'PUT') {
    $input = getJsonInput();

    if (!isset($input['id'])) {
        sendResponse(['error' => 'Booking ID is required'], 400);
    }

    $bookings = readJsonFile(BOOKINGS_FILE);
    $bookingFound = false;

    foreach ($bookings as &$booking) {
        if ($booking['id'] === $input['id']) {
            // Update allowed fields
            if (isset($input['status'])) {
                $booking['status'] = $input['status'];
            }
            if (isset($input['guestName'])) {
                $booking['guestName'] = $input['guestName'];
            }
            if (isset($input['purpose'])) {
                $booking['purpose'] = $input['purpose'];
            }
            $booking['updatedAt'] = date('Y-m-d H:i:s');
            $bookingFound = true;
            break;
        }
    }

    if (!$bookingFound) {
        sendResponse(['error' => 'Booking not found'], 404);
    }

    writeJsonFile(BOOKINGS_FILE, $bookings);

    sendResponse([
        'success' => true,
        'message' => 'Booking updated successfully'
    ]);
}

// DELETE - Cancel booking
if ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        sendResponse(['error' => 'Booking ID is required'], 400);
    }

    $bookingId = $_GET['id'];
    $bookings = readJsonFile(BOOKINGS_FILE);
    $bookingFound = false;

    foreach ($bookings as &$booking) {
        if ($booking['id'] === $bookingId) {
            $booking['status'] = 'cancelled';
            $booking['cancelledAt'] = date('Y-m-d H:i:s');
            $bookingFound = true;
            break;
        }
    }

    if (!$bookingFound) {
        sendResponse(['error' => 'Booking not found'], 404);
    }

    writeJsonFile(BOOKINGS_FILE, $bookings);

    sendResponse([
        'success' => true,
        'message' => 'Booking cancelled successfully'
    ]);
}

sendResponse(['error' => 'Method not allowed'], 405);
