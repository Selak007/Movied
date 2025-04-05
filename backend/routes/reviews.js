const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure the database connection is imported

// ✅ GET Reviews & Average Rating for a Movie (Includes Username)
router.get("/:movie_id", async (req, res) => {
  const { movie_id } = req.params;

  try {
    // Fetch reviews with username
    const [reviews] = await db.promise().query(
      `SELECT r.rating, r.comment, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.movie_id = ?`,
      [movie_id]
    );

    // Fetch average rating
    const [avgResult] = await db.promise().query(
      "SELECT AVG(rating) AS avg_rating FROM reviews WHERE movie_id = ?",
      [movie_id]
    );

    const avg_rating = avgResult.length > 0 && avgResult[0].avg_rating !== null 
      ? Number(avgResult[0].avg_rating).toFixed(1) 
      : "0.0";

    res.json({ reviews: reviews || [], avg_rating });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST: Add a Review (Includes User ID)
router.post("/:movie_id", async (req, res) => {
  const { movie_id } = req.params;
  const { user_id, rating, comment } = req.body;

  console.log("Received Review from User ID:", user_id);

  if (!user_id || !rating) {
    return res.status(400).json({ error: "User ID and rating are required." });
  }

  try {
    // Insert the review
    await db.promise().query(
      "INSERT INTO reviews (movie_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [movie_id, user_id, rating, comment || ""]
    );

    // Fetch updated reviews (Including Username)
    const [reviews] = await db.promise().query(
      `SELECT r.rating, r.comment, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.movie_id = ?`,
      [movie_id]
    );

    // Fetch updated average rating
    const [avgResult] = await db.promise().query(
      "SELECT AVG(rating) AS avg_rating FROM reviews WHERE movie_id = ?",
      [movie_id]
    );

    const avg_rating = avgResult.length > 0 && avgResult[0].avg_rating !== null 
      ? Number(avgResult[0].avg_rating).toFixed(1) 
      : "0.0";

    res.json({ reviews, avg_rating });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
