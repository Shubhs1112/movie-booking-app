import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilm } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../admin/AdminNavbar';

const AddShows = () => {
  const [formData, setFormData] = useState({
    selectedMovie: '',
    selectedScreen: '1',
    showDate: new Date(),
    showEndDate: new Date(),
    showTime: '',
    movieId: '',  
  });

  const [movies, setMovies] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8180/management/Admin/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const movieList = await response.json();
        setMovies(movieList);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setSubmitError('Failed to fetch movie data');
      }
    };

    fetchMovies();
  }, []); // Only run once on mount

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.selectedMovie) newErrors.selectedMovie = 'Movie selection is required';
    if (!formData.showDate) newErrors.showDate = 'Show date is required';
    if (!formData.showEndDate) newErrors.showEndDate = 'Show end date is required';
    if (!formData.showTime) newErrors.showTime = 'Show time is required';
    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle movie selection
  const handleMovieChange = (e) => {
    const selectedMovieId = e.target.value;
    // const selectedMovie = movies.find(movie => movie.movieId === parseInt(selectedMovieId));
    setFormData((prev) => ({
      ...prev,
      selectedMovie: selectedMovieId,
      movieId: selectedMovieId, // Set the movieId when a movie is selected
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true); // Disable button during submission
    setSuccessMessage('');  // Clear previous success message

    try {
      // Send formData to API (replace with real API endpoint)
      const response = await fetch('http://localhost:8180/management/Admin/add-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: formData.movieId,
          screenId: formData.selectedScreen,
          showDate: formData.showDate.toISOString(), // Ensure the date is in ISO format
          showEndDate: formData.showEndDate.toISOString(),
          showTime: formData.showTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add show');
      }

      // Success: show success message
      setSuccessMessage('Show added successfully!');

      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      // Reset form on successful submission
      setFormData({
        selectedMovie: '',
        selectedScreen: '1',
        showDate: new Date(),
        showEndDate: new Date(),
        showTime: '',
        movieId: '', // Reset movieId as well
      });
      setErrors({});
      setSubmitError('');
    } catch (error) {
      console.error('Error adding show:', error);
      setSubmitError(error.message || 'Failed to add show. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        {submitError && <div className="alert alert-danger">{submitError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-light bg-opacity-75">
          <h1><FaFilm /> Add Show</h1>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Select Movie</label>
              <select
                name="selectedMovie"
                value={formData.selectedMovie}
                onChange={handleMovieChange}
                className={`form-control ${errors.selectedMovie ? 'is-invalid' : ''}`}
              >
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie.movieId} value={movie.movieId}>
                    {movie.movieName}
                  </option>
                ))}
              </select>
              {errors.selectedMovie && <div className="invalid-feedback">{errors.selectedMovie}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Movie ID</label>
              <input
                type="text"
                name="movieId"
                value={formData.movieId}
                disabled
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Select Screen</label>
              <select
                name="selectedScreen"
                value={formData.selectedScreen}
                onChange={handleInputChange}
                className={`form-control ${errors.selectedScreen ? 'is-invalid' : ''}`}
              >
                <option value="1">Screen 1</option>
                <option value="2">Screen 2</option>
                <option value="3">Screen 3</option>
              </select>
              {errors.selectedScreen && <div className="invalid-feedback">{errors.selectedScreen}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Show Date</label>
              <DatePicker
                selected={formData.showDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, showDate: date }))}
                className={`form-control ${errors.showDate ? 'is-invalid' : ''}`}
                dateFormat="yyyy-MM-dd"
              />
              {errors.showDate && <div className="invalid-feedback">{errors.showDate}</div>}
            </div>

            {/* <div className="col-md-6 mb-3">
              <label className="form-label">Show End Date</label>
              <DatePicker
                selected={formData.showEndDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, showEndDate: date }))}
                className={`form-control ${errors.showEndDate ? 'is-invalid' : ''}`}
                dateFormat="yyyy-MM-dd"
              />
              {errors.showEndDate && <div className="invalid-feedback">{errors.showEndDate}</div>}
            </div> */}
          </div>


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
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Show'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddShows;
