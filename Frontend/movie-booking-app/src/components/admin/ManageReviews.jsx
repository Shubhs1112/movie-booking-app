import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../admin/AdminNavbar';

const ManageReviews = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [movieName, setMovieName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7276/api/Admin/movies/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovieName(data.movieName);
      } catch (err) {
        setError(err.message || 'Failed to fetch movie details');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://localhost:7276/api/Admin/GetReviewsByMovieId/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        
        if (data.message === "No reviews found for this movie.") {
          setReviews([]);
        } else {
          setReviews(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
    fetchReviews();
  }, [movieId]);

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Reviews - {movieName || 'N/A'}</h1>
        </div>

        {error && error !== 'Failed to fetch reviews' && <div className="alert alert-danger">{error}</div>}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Review Message</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.userid}>
                    <td>{review.user.userId}</td>
                    <td>{review.user.username}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.reviewMsg}
                    </td>
                    <td>{review.rating}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No reviews available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <button 
            className="btn btn-danger" 
            onClick={() => navigate('/admin-dashboard', { state: { selectedComponent: 'manageMovie' } })}
          >
            &larr; Back
          </button>
      </div>
    </>
  );
};

export default ManageReviews;