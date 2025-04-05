const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all movies from the database
router.get("/movies", (req, res) => {
    const query = "SELECT * FROM movies"; // Fetch all movies

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ movies: results });
    });
});

// ✅ Get a specific movie by ID
router.get("/movies/:id", (req, res) => {
    const movieId = req.params.id;
    const query = "SELECT * FROM movies WHERE tconst = ?"; // `tconst` is the primary key

    db.query(query, [movieId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.json({ movie: results[0] });
    });
});

module.exports = router;
