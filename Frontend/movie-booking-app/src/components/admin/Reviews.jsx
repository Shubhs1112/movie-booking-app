import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaRegComment } from 'react-icons/fa'; // Importing FaFilm for icon usage

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New state to handle movie name filter
  const [movieNameFilter, setMovieNameFilter] = useState('');
  
  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8180/management/Admin/GetReviewsWithUsers');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data); // Initially, show all reviews
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on movie name
  const handleMovieNameFilterChange = (event) => {
    const filter = event.target.value.toLowerCase();
    setMovieNameFilter(event.target.value);

    // Filter reviews based on movie name and update the filtered reviews
    const filtered = reviews.filter((review) =>
      review.movieName.toLowerCase().includes(filter)
    );
    setFilteredReviews(filtered);
  };

  return (
    <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
      <div className="d-flex justify-content-between align-items-center">
        <h1><FaRegComment /> Reviews</h1>
        {/* Movie name filter input */}
        <div className="mb-3">
            <input
            type="text"
            className="form-control"
            placeholder="Search by movie name"
            value={movieNameFilter}
            onChange={handleMovieNameFilterChange}
        />
      </div>
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
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
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
