import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFilm } from 'react-icons/fa'; // Importing FaFilm for icon usage

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://localhost:7276/api/Admin/GetReviewsWithUsers');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
      <div className="d-flex justify-content-between align-items-center">
        <h1><FaFilm /> Reviews</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered table-rounded mt-4">
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Review Message</th>
              <th>Rating</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>{review.movieName}</td>
                  <td>{review.reviewMsg || 'N/A'}</td>
                  <td>{review.rating || 'N/A'}</td>
                  <td>{review.user.username}</td>
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
    </div>
  );
};

export default Reviews;
