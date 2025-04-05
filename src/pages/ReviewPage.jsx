import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const backgroundImages = [ // Images must be inside /public/backgrounds/
  "/backgrounds/background1.jpg",
  "/backgrounds/background2.jpg",
  "/backgrounds/background3.jpg",
  "/backgrounds/background4.jpg",
  "/backgrounds/background5.jpg",
  "/backgrounds/background6.jpg",
  "/backgrounds/background7.jpg",
];

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [movieTitle, setMovieTitle] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewRes, movieRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/reviews/${id}`),
          axios.get(`http://localhost:5000/api/movies/${id}`)
        ]);
        setReviews(reviewRes.data.reviews || []);
        setAvgRating(parseFloat(reviewRes.data.avg_rating) || 0);
        setMovieTitle(movieRes.data.movie.primaryTitle || "Movie");
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const getRatingStroke = (avg) => {
    const percent = (avg / 5) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percent / 100) * circumference;
    return offset;
  };

  return (
    <div
      className="fullscreen-review-page"
      style={{
        backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out"
      }}
    >
      <div className="overlay">
        <div className="review-header">
          <button onClick={() => navigate(-1)} className="back-button">⬅ Back</button>
          <h1 className="review-title">Reviews for <span>{movieTitle}</span></h1>
          <div className="rating-circle-container">
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="45" stroke="#ccc" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="#ffd700"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={getRatingStroke(avgRating)}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="65" textAnchor="middle" fontSize="18" fill="#333">
                {typeof avgRating === "number" && !isNaN(avgRating)
                  ? avgRating.toFixed(1) + " / 5"
                  : "N/A"}
              </text>
            </svg>
            <p>Avg. Rating</p>
          </div>
        </div>

        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-meta">
                  <strong>{review.username || "Anonymous"}</strong>
                  <span>⭐ {review.rating}/5</span>
                </div>
                <p>{review.comment || <i>No comment provided.</i>}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
