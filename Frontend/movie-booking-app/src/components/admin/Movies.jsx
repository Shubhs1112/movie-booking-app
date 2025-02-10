import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilm } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [movieNameFilter, setMovieNameFilter] = useState('');
  const [movieGenreFilter, setMovieGenreFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8180/management/Admin/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data); // Initially, show all movies
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Functions for handling reviews
  const handleReviews = (movieId) => {
    navigate(`/admin/manage-reviews/${movieId}`);
  };

  // Handle movie name filter change
  const handleMovieNameFilterChange = (event) => {
    const filtered = movies.filter((movie) =>
      movie.movieName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setMovieNameFilter(event.target.value);
    setFilteredMovies(filtered);
  };

  // Handle movie genre filter change
  const handleMovieGenreFilterChange = (event) => {
    const filtered = movies.filter((movie) =>
      movie.movieGenre.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setMovieGenreFilter(event.target.value);
    setFilteredMovies(filtered);
  };

  return (
    <>
      <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h1><FaFilm /> All Movies</h1>
          <Link to="/admin/add-movie" className="btn btn-primary">
            Add New Movie
          </Link>
        </div>
        
        {/* Filter Section */}
        <div className="d-flex align-items-center mt-3">
          {/* Movie Name Filter */}
          <input
            type="text"
            className="form-control me-3"
            placeholder="Search movie"
            value={movieNameFilter}
            onChange={handleMovieNameFilterChange}
          />
          
          {/* Movie Genre Filter */}
          <input
            type="text"
            className="form-control me-3"
            placeholder="Filter by genre"
            value={movieGenreFilter}
            onChange={handleMovieGenreFilterChange}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="table table-bordered table-rounded mt-4">
            <thead>
              <tr>
                <th>Movie Name</th>
                <th>Description</th>
                <th>Language</th>
                <th>Genre</th>
                <th>Release Date</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <tr key={movie.movieId}>
                    <td style={{ maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.movieName}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.movieDescription || 'N/A'}
                    </td>
                    <td>{movie.movieLanguage}</td>
                    <td>{movie.movieGenre || 'N/A'}</td>
                    <td>{new Date(movie.movieReleaseDate).toLocaleDateString()}</td>
                    <td>{movie.movieDuration || 'N/A'}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link
                        to={`/admin/update-movie/${movie.movieId}`} // Link to the UpdateMovie component with movieId as parameter
                        className="btn btn-warning btn-sm mx-1"
                      >
                        Edit Movie
                      </Link>
                      <button
                        className="btn btn-warning btn-sm mx-1"
                        onClick={() => handleReviews(movie.movieId)}
                      >
                        Manage Reviews
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No movies available
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

export default Movies;
