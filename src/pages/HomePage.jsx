import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });

    axios
      .get("http://localhost:5000/api/movies")
      .then((res) => setMovies(res.data.movies || []))
      .catch(() => {});
  }, [navigate]);

  const filteredMovies = movies.filter((movie) =>
    movie.primaryTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMovies =
    searchQuery.trim() === "" ? filteredMovies.slice(0, 5) : [];

  const handleWatchlistChange = async (movie_id, status) => {
    try {
      await axios.post("http://localhost:5000/api/watchlist", {
        user_id: user.id,
        movie_id,
        status,
      });
      setDropdownVisible((prev) => ({ ...prev, [movie_id]: false }));
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    }
  };

  const toggleDropdown = (movie_id) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [movie_id]: !prev[movie_id],
    }));
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to Movied!</h1>

      {user ? (
        <p className="user-welcome">Hello, {user.username}!</p>
      ) : (
        <p className="loading-message">Loading user data...</p>
      )}

      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="movie-grid">
        {displayedMovies.map((movie) => (
          <div key={movie.tconst} className="movie-card">
            <div
              className="watchlist-dropdown"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(movie.tconst);
              }}
            >
              <button className="watchlist-button">➕</button>
              {dropdownVisible[movie.tconst] && (
                <div className="watchlist-options show">
                  <div
                    className="watchlist-option"
                    onClick={() =>
                      handleWatchlistChange(movie.tconst, "watched")
                    }
                  >
                    ✅ Watched
                  </div>
                  <div
                    className="watchlist-option"
                    onClick={() =>
                      handleWatchlistChange(movie.tconst, "watching")
                    }
                  >
                    👀 Watching
                  </div>
                  <div
                    className="watchlist-option"
                    onClick={() =>
                      handleWatchlistChange(movie.tconst, "want_to_watch")
                    }
                  >
                    🎯 Want to Watch
                  </div>
                </div>
              )}
            </div>

            <img
              src={
                movie.poster?.startsWith("http")
                  ? movie.poster
                  : movie.poster || "/images/default.jpg"
              }
              alt={movie.primaryTitle}
              className="movie-poster"
              onClick={() => navigate(`/movies/${movie.tconst}`)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x600?text=No+Image";
              }}
            />
            <div className="movie-info-box" onClick={() => navigate(`/movies/${movie.tconst}`)}>
              <h2 className="movie-title">{movie.primaryTitle}</h2>
              <p className="movie-meta">
                {movie.year || "N/A"} | {movie.genres || "Unknown"}
              </p>
              <div className="rating-stars">
  {(() => {
    const avg = parseFloat(movie.averageRating);
    let rounded = isNaN(avg) ? 0 : Math.round(avg);

    // Clamp to valid star range
    rounded = Math.max(0, Math.min(5, rounded));

    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  })()}
</div>

            </div>
          </div>
        ))}
      </div>

      {searchQuery.trim() !== "" && (
        <div className="search-results">
          <h3 className="section-title">Search Results</h3>
          <ul className="search-list">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <li
                  key={movie.tconst}
                  className="search-item"
                  onClick={() => navigate(`/movies/${movie.tconst}`)}
                >
                  {movie.primaryTitle}
                </li>
              ))
            ) : (
              <li className="search-item">No matching movies found.</li>
            )}
          </ul>
        </div>
      )}

      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
