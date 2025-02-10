import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaUpload, FaFilm } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../admin/AdminNavbar';

const AddMovie = () => {
  const [formData, setFormData] = useState({
    movieName: '',
    movieDescription: '',
    movieDuration: '',
    movieReleaseDate: new Date(),
    movieLanguage: 'English',
    movieGenre: '',
    movieTrailer: '',
    moviePoster: null,  // Now handling file correctly
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();


  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.movieName.trim()) newErrors.movieName = 'Movie name is required';
    if (!formData.movieDescription.trim()) newErrors.movieDescription = 'Description is required';
    if (!formData.movieDuration.trim()) newErrors.movieDuration = 'Duration is required';
    if (!formData.movieReleaseDate) newErrors.movieReleaseDate = 'Release date is required';
    if (!formData.movieGenre.trim()) newErrors.movieGenre = 'Genre is required';
    if (!formData.movieTrailer.trim()) newErrors.movieTrailer = 'Trailer link is required';
    if (!formData.moviePoster) newErrors.moviePoster = 'Poster is required';
    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, moviePoster: file })); // Store file object
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      const formDataToSend = new FormData();
      formDataToSend.append('MovieName', formData.movieName);
      formDataToSend.append('MovieDescription', formData.movieDescription);
      formDataToSend.append('MovieDuration', formData.movieDuration);
      formDataToSend.append('MovieReleaseDate', formData.movieReleaseDate.toISOString().split('T')[0]); // Ensure correct date format
      formDataToSend.append('MovieLanguage', formData.movieLanguage);
      formDataToSend.append('MovieGenre', formData.movieGenre);
      formDataToSend.append('MovieTrailer', formData.movieTrailer);
      if (formData.moviePoster) {
        formDataToSend.append('PosterFile', formData.moviePoster);
      }

      try {
        const response = await fetch('http://localhost:8180/management/Admin/add-movie', {
            method: 'POST',
            body: formDataToSend,
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server Error Response:", errorData);  
          console.error("Validation Errors:", errorData.errors);  
          throw new Error(errorData.title || "Failed to add movie");
        }
      } catch (error) {
          console.error("Error adding movie:", error);
          setSubmitError(error.message || "Failed to add movie. Please try again.");
      }
    
      // Success: show success message
      setSuccessMessage('Movie added successfully!');

      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      // Reset form on successful submission
      setFormData({
        movieName: '',
        movieDescription: '',
        movieDuration: '',
        movieReleaseDate: new Date(),
        movieLanguage: 'English',
        movieGenre: '',
        movieTrailer: '',
        moviePoster: null,
      });
      setPreviewImage(null);
      setErrors({});
      setSubmitError('');
    } catch (error) {
      console.error('Error adding movie:', error);
      setSubmitError(error.message || 'Failed to add movie. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <>
      <AdminNavbar/>
      <div className="container mt-5">
        {submitError && <div className="alert alert-danger">{submitError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-light bg-opacity-75">
         <h1><FaFilm /> Add Movie</h1>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Movie Name</label>
              <input
                type="text"
                name="movieName"
                value={formData.movieName}
                onChange={handleInputChange}
                className={`form-control ${errors.movieName ? 'is-invalid' : ''}`}
              />
              {errors.movieName && <div className="invalid-feedback">{errors.movieName}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Movie Genre</label>
              <select
                name="movieGenre"
                value={formData.movieGenre}
                onChange={handleInputChange}
                className={`form-control ${errors.movieGenre ? 'is-invalid' : ''}`}
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
              </select>
              {errors.movieGenre && <div className="invalid-feedback">{errors.movieGenre}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Movie Description</label>
            <textarea
              name="movieDescription"
              value={formData.movieDescription}
              onChange={handleInputChange}
              className={`form-control ${errors.movieDescription ? 'is-invalid' : ''}`}
            />
            {errors.movieDescription && <div className="invalid-feedback">{errors.movieDescription}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Movie Duration</label>
              <input
                type="text"
                name="movieDuration"
                value={formData.movieDuration}
                onChange={handleInputChange}
                className={`form-control ${errors.movieDuration ? 'is-invalid' : ''}`}
              />
              {errors.movieDuration && <div className="invalid-feedback">{errors.movieDuration}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Movie Language</label>
              <select
                name="movieLanguage"
                value={formData.movieLanguage}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Movie Release Date</label>
            <DatePicker
              selected={formData.movieReleaseDate}
              onChange={(date) => setFormData(prev => ({ ...prev, movieReleaseDate: date }))}
              className={`form-control ${errors.movieReleaseDate ? 'is-invalid' : ''}`}
              dateFormat="yyyy-MM-dd"
            />
            {errors.movieReleaseDate && <div className="invalid-feedback">{errors.movieReleaseDate}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Trailer Link</label>
            <input
              type="text"
              name="movieTrailer"
              value={formData.movieTrailer}
              onChange={handleInputChange}
              className={`form-control ${errors.movieTrailer ? 'is-invalid' : ''}`}
            />
            {errors.movieTrailer && <div className="invalid-feedback">{errors.movieTrailer}</div>}
          </div>
          
          <div className="mb-3">
            <label className="form-label"><FaUpload /> Upload Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`form-control ${errors.moviePoster ? 'is-invalid' : ''}`}
            />
            {errors.moviePoster && <div className="invalid-feedback">{errors.moviePoster}</div>}
            {previewImage && <img src={previewImage} alt="Poster preview" className="img-thumbnail mt-2" style={{ maxWidth: '200px' }} />}
          </div>

          <button 
            type="button" 
            className="btn btn-danger m-1" 
            onClick={(e) => {
              e.preventDefault(); 
              navigate('/admin-dashboard', { state: { selectedComponent: 'manageMovie' } });
            }}
          >
            &larr; Back 
          </button>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Movie'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddMovie;
