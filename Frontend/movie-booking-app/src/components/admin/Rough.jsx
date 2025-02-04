import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilm } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from './AdminNavbar';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://localhost:7276/api/Admin/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Functions for handling update and delete
  const handleUpdate = (movieId) => {
    // Logic for updating the movie (e.g., navigate to an update page)
    console.log(`Update movie with ID: ${movieId}`);
  };

  const handleDelete = (movieId) => {
    // Logic for deleting the movie
    console.log(`Delete movie with ID: ${movieId}`);
    // You can make an API call here to delete the movie from the database.
    // After deletion, update the state to remove the movie from the UI.
    setMovies(movies.filter(movie => movie.movieId !== movieId));
  };

  return (
    <>
      <div className="container mt-5 bg-light bg-opacity-75 border p-4 rounded">
        <h1><FaFilm /> All Movies</h1>
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
                {/* <th>Poster</th> */}
                <th>Actions</th> {/* New column for actions */}
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie.movieId}>
                    <td>{movie.movieName}</td>
                    <td>{movie.movieDescription || 'N/A'}</td>
                    <td>{movie.movieLanguage}</td>
                    <td>{movie.movieGenre || 'N/A'}</td>
                    <td>{new Date(movie.movieReleaseDate).toLocaleDateString()}</td>
                    <td>{movie.movieDuration || 'N/A'}</td>
                    {/* <td>
                      {movie.moviePoster ? (
                        <img 
                          src={movie.moviePoster} 
                          alt={movie.movieName} 
                          style={{ width: '100px', height: 'auto' }} 
                        />
                      ) : (
                        'N/A'
                      )}
                    </td> */}
                    <td>
                      <button
                        className="btn btn-warning btn-sm mx-1"
                        onClick={() => handleUpdate(movie.movieId)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm mx-1"
                        onClick={() => handleDelete(movie.movieId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
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
