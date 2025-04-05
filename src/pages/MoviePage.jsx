// MoviePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/moviepage.css";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        const user = JSON.parse(loggedInUser);
        setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`),
          axios.get(`http://localhost:5000/api/reviews/${id}`)
        ]);

        const fetchedMovie = movieRes.data.movie;
        fetchedMovie.genres = Array.isArray(fetchedMovie.genres)
          ? fetchedMovie.genres
          : typeof fetchedMovie.genres === "string"
          ? fetchedMovie.genres.split(",").map(g => g.trim())
          : [];

        setMovie(fetchedMovie);
        setAvgRating(reviewRes.data.avg_rating ? parseFloat(reviewRes.data.avg_rating) : 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load movie details. Please try again.");
      }
    };

    fetchMovieData();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!rating && !comment.trim()) {
      alert("Please provide a rating or comment before submitting.");
      return;
    }
    if (!userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/reviews/${id}`, {
        user_id: userId,
        rating,
        comment
      });

      setRating(0);
      setComment("");
      alert("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!movie) return <p className="loading-text">Loading movie details...</p>;

  return (
    <div className="movie-page-full">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Back</button>

      <div className="movie-main-content">
        <div className="poster-container">
          <img 
            src={movie.poster || "/default-poster.jpg"} 
            alt={movie.primaryTitle} 
            className="movie-poster" 
          />
        </div>

        <div className="movie-details">
          <h1 className="movie-title">{movie.primaryTitle} <span className="movie-year">({movie.year || 'N/A'})</span></h1>
          <p><strong>Director:</strong> {movie.director || 'Unknown'}</p>
          <p><strong>Writer:</strong> {movie.writer || 'Unknown'}</p>
          <p><strong>Language:</strong> {movie.language || 'N/A'}</p>
          <p><strong>Runtime:</strong> {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : "N/A"}</p>

          <div className="movie-genres">
            {movie.genres.length > 0 ? (
              movie.genres.map((genre, i) => (
                <span key={i} className="tag">{genre}</span>
              ))
            ) : (
              <span className="tag">No genres</span>
            )}
          </div>

          <p className="avg-rating">
            ⭐ Average Rating: {(typeof avgRating === "number" ? avgRating.toFixed(1) : "N/A")}/5
          </p>

          <div className="rating-form">
            <p className="rating-label">Rate this movie:</p>
            <div className="star-container">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={`star ${star <= rating ? "star-active" : "star-inactive"}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <textarea 
              className="review-input" 
              placeholder="Write your review..." 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleSubmitReview} className="submit-btn">Submit Review</button>
          </div>

          <button className="view-reviews-btn" onClick={() => navigate(`/reviews/${id}`)}>
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
