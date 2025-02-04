import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaClock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../admin/AdminNavbar';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateShow = () => {
  const [formData, setFormData] = useState({
    showId: '',
    showDate: new Date(),
    showTime: '',
    screenId: '',
    movieName: '', // New field for movie name
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`https://localhost:7276/api/Admin/show/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch show data');
        }
        const data = await response.json();

        // Ensure showTime is in HH:mm:ss format
        const formattedTime = data.showTime.length === 5 ? `${data.showTime}:00` : data.showTime;

        setFormData({
          showId: data.showId,
          showDate: new Date(data.showDate),
          showTime: formattedTime,
          screenId: data.screen.screenId,
          movieName: data.movie.movieName, // Fetch and store movie name
        });
      } catch (err) {
        setSubmitError(err.message || 'Failed to fetch show data');
      }
    };

    fetchShow();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.showDate) newErrors.showDate = 'Show date is required';
    if (!formData.showTime.trim()) newErrors.showTime = 'Show time is required';

    // Ensure screenId is treated as a string before calling trim()
    if (!String(formData.screenId).trim()) newErrors.screenId = 'Screen ID is required';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const response = await fetch(`https://localhost:7276/api/Admin/update-show/${formData.showId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showDate: formData.showDate.toISOString().split('T')[0],
          showTime: formData.showTime,
          screenId: formData.screenId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update show');
      }

      setSuccessMessage('Show updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setSubmitError(error.message || 'Failed to update show. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        {submitError && <div className="alert alert-danger">{submitError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-light bg-opacity-75">
          <h1><FaClock /> Update Show</h1>

          {/* Show ID (Disabled) */}
          <div className="mb-3">
            <label className="form-label">Show ID</label>
            <input
              type="text"
              name="showId"
              value={formData.showId}
              disabled
              className="form-control"
            />
          </div>

          {/* Movie Name (Disabled) */}
          <div className="mb-3">
            <label className="form-label">Movie Name</label>
            <input
              type="text"
              name="movieName"
              value={formData.movieName}
              disabled
              className="form-control"
            />
          </div>

          {/* Show Date (Editable) */}
          <div className="mb-3">
            <label className="form-label">Show Date</label>
            <DatePicker
              selected={formData.showDate}
              onChange={(date) => setFormData((prev) => ({ ...prev, showDate: date }))}
              className={`form-control ${errors.showDate ? 'is-invalid' : ''}`}
              dateFormat="yyyy-MM-dd"
            />
            {errors.showDate && <div className="invalid-feedback">{errors.showDate}</div>}
          </div>

          {/* Show Time (Editable) */}
          <div className="mb-3">
            <label className="form-label">Show Time</label>
            <select
              name="showTime"
              value={formData.showTime}
              onChange={handleInputChange}
              className={`form-control ${errors.showTime ? 'is-invalid' : ''}`}
            >
              <option value="">Select Show Time</option>
              <option value="11:00:00">11:00 AM</option>
              <option value="14:00:00">02:00 PM</option>
              <option value="16:00:00">05:00 PM</option>
              <option value="20:00:00">08:00 PM</option>
            </select>
            {errors.showTime && <div className="invalid-feedback">{errors.showTime}</div>}
          </div>

          {/* Screen ID (Editable) */}
          <div className="mb-3">
            <label className="form-label">Screen ID</label> 
            <select
              name="screenId"
              value={formData.screenId}
              onChange={handleInputChange}
              className={`form-control ${errors.screenId ? 'is-invalid' : ''}`}
            >
                <option value="1">Screen 1</option>
                <option value="2">Screen 2</option>
                <option value="3">Screen 3</option>
            </select>
            {errors.screenId && <div className="invalid-feedback">{errors.screenId}</div>}
          </div>

          <button 
            type="button" 
            className="btn btn-danger m-1" 
            onClick={(e) => {
              e.preventDefault(); 
              navigate('/admin-dashboard', { state: { selectedComponent: 'currentShows' } });
            }}
          >
            &larr; Back 
          </button>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Show'}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateShow;
