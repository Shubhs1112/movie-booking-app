import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilm } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Import Link for navigation

const CurrentShows = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filters states
  const [movieNameFilter, setMovieNameFilter] = useState('');
  const [showTimeFilter, setShowTimeFilter] = useState('');

  // Available show times
  const [showTimes, setShowTimes] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8180/management/Admin/current-shows');
        if (!response.ok) {
          throw new Error('Failed to fetch current shows');
        }
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data); // Initially, show all movies

        // Extract unique show times for the dropdown
        const uniqueShowTimes = [
          ...new Set(data.map(show => show.showTime))
        ];
        setShowTimes(uniqueShowTimes);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle delete show functionality
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async (showId) => {
    if (!window.confirm("Are you sure you want to delete this show?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8180/management/Admin/delete-show/${showId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the show');
      }

      // Update UI by filtering out the deleted show
      setMovies(movies.filter(show => show.showId !== showId));
      setFilteredMovies(filteredMovies.filter(show => show.showId !== showId));

      // Show success message
      setSuccessMessage("Show deleted successfully!");

      // Hide message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setError(error.message || "Error deleting show.");
    }
  };

  // Filter movies by movie name and show time
  const handleMovieNameFilterChange = (event) => {
    const filtered = movies.filter((show) =>
      show.movie.movieName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setMovieNameFilter(event.target.value);
    setFilteredMovies(filtered);
  };

  const handleShowTimeFilterChange = (event) => {
    const selectedTime = event.target.value;
    setShowTimeFilter(selectedTime);

    if (selectedTime) {
      const filtered = movies.filter((show) => show.showTime === selectedTime);
      setFilteredMovies(filtered);
    } else {
      // If no time is selected, reset to show all movies
      setFilteredMovies(movies);
    }
  };

  return (
    <>
      <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h1><FaFilm /> Current Shows</h1>

          <div className="d-flex align-items-center">
            {/* Movie Name Filter */}
            <input
              type="text"
              className="form-control me-3"
              placeholder="Search movie"
              value={movieNameFilter}
              onChange={handleMovieNameFilterChange}
            />

            {/* Show Time Filter Dropdown */}
            <select
              className="form-control me-3"
              value={showTimeFilter}
              onChange={handleShowTimeFilterChange}
            >
              <option value="">Filter by show time</option>
              {showTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <Link to="/admin/add-show" className="btn btn-primary ms-3" style={{ whiteSpace: 'nowrap' }}>
              Add Show
            </Link>
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
                <th>Duration</th>
                <th>Show Date</th>
                <th>Language</th>
                <th>Genre</th>
                <th>Show Time</th>
                <th>Screen</th>
                <th>Actions</th> {/* Added Actions column */}
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length > 0 ? (
                filteredMovies.map((show) => {
                  const movie = show.movie; // Access the movie object inside show
                  return (
                    <tr key={show.showId}>
                      <td>{movie.movieName}</td>
                      <td>{movie.movieDuration || 'N/A'}</td>
                      <td>{new Date(show.showDate).toLocaleDateString()}</td>
                      <td>{movie.movieLanguage}</td>
                      <td>{movie.movieGenre || 'N/A'}</td>
                      <td>{show.showTime}</td>
                      <td>{show.screen.description}</td>
                      <td>
                        <Link
                          to={`/admin/update-show/${show.showId}`}
                          className="btn btn-warning btn-sm mx-1"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm mx-1"
                          onClick={() => handleDelete(show.showId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No shows available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CurrentShows;
