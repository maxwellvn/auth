import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [newBooking, setNewBooking] = useState({
    date: '',
    timeSlot: '',
    guestName: '',
    purpose: '',
  });

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll(user.email);
      if (response.success) {
        setBookings(response.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await bookingsAPI.create({
        userEmail: user.email,
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        guestName: newBooking.guestName,
        purpose: newBooking.purpose,
      });

      if (response.success) {
        setSuccessMessage('Booking created successfully!');
        setShowBookingForm(false);
        setNewBooking({ date: '', timeSlot: '', guestName: '', purpose: '' });
        fetchBookings();
      } else {
        setError(response.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await bookingsAPI.cancel(bookingId);
      if (response.success) {
        setSuccessMessage('Booking cancelled successfully!');
        fetchBookings();
      } else {
        setError(response.error || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Cancel error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Angel Court Lounge</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="actions-bar">
          <h2>Your Bookings</h2>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="new-booking-btn"
          >
            {showBookingForm ? 'Cancel' : '+ New Booking'}
          </button>
        </div>

        {showBookingForm && (
          <div className="booking-form-card">
            <h3>Schedule a Visit</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newBooking.date}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, date: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot</label>
                <select
                  id="timeSlot"
                  value={newBooking.timeSlot}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, timeSlot: e.target.value })
                  }
                  required
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="guestName">Guest Name (Optional)</label>
                <input
                  type="text"
                  id="guestName"
                  value={newBooking.guestName}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, guestName: e.target.value })
                  }
                  placeholder="If booking for someone else"
                />
              </div>

              <div className="form-group">
                <label htmlFor="purpose">Purpose of Visit (Optional)</label>
                <textarea
                  id="purpose"
                  value={newBooking.purpose}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, purpose: e.target.value })
                  }
                  placeholder="Brief description of your visit"
                  rows="3"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Creating...' : 'Create Booking'}
              </button>
            </form>
          </div>
        )}

        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings yet. Create your first booking!</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className={`booking-card ${booking.status}`}
              >
                <div className="booking-header">
                  <h3>{formatDate(booking.date)}</h3>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p>
                    <strong>Time:</strong> {booking.timeSlot}
                  </p>
                  {booking.guestName && (
                    <p>
                      <strong>Guest:</strong> {booking.guestName}
                    </p>
                  )}
                  {booking.purpose && (
                    <p>
                      <strong>Purpose:</strong> {booking.purpose}
                    </p>
                  )}
                  <p className="booking-date">
                    Booked on {formatDate(booking.createdAt)}
                  </p>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="cancel-btn"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
