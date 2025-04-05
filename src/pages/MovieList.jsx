import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css"; // Ensure you have this CSS file

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        const user = JSON.parse(loggedInUser);
        console.log("User from localStorage:", user); // Debugging
        setUserId(user.id);
        setUsername(user.username);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);
  

  // Fetch movies from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/movies") // Ensure correct API endpoint
      .then(response => {
        setMovies(response.data.movies); // Assuming API returns { movies: [...] }
      })
      .catch(error => console.error("Error fetching movies:", error));
  }, []);

  // Filter movies based on search query
  const filteredMovies = movies.filter((movie) =>
    (movie.primaryTitle || movie.title).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="movie-list-container">
      <h1 className="movie-list-title">Movies</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id || movie.tconst}
            className="movie-card"
            onClick={() => navigate(`/movies/${movie.id || movie.tconst}`)}
          >
            <img
              src={movie.poster || "/default-poster.jpg"}
              alt={movie.primaryTitle || movie.title}
              className="movie-poster"
            />
            <h2 className="movie-title">{movie.primaryTitle || movie.title}</h2>
            <p className="movie-year">{movie.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
