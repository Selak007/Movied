const express = require("express");
const router = express.Router();
const db = require("../db"); // adjust the path if your db.js is elsewhere

// POST /api/watchlist - Add or update a movie in user's watchlist
router.post("/", (req, res) => {
  const { user_id, movie_id, status } = req.body;

  const sql = `
    INSERT INTO watchlist (user_id, movie_id, status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  db.query(sql, [user_id, movie_id, status], (err, result) => {
    if (err) {
      console.error("Error inserting into watchlist:", err);
      return res.status(500).json({ error: "Failed to update watchlist" });
    }
    res.json({ success: true, message: "Watchlist updated" });
  });
});

module.exports = router;
