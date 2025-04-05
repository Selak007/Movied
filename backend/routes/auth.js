const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

// Hardcoded secret key (since you're not using environment variables)
const JWT_SECRET = "mySuperSecretKey";

// User Registration
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into database
            const insertUserQuery = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
            db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("User insertion error:", err);
                    return res.status(500).json({ message: "Failed to register user" });
                }

                // Generate JWT token
                const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: "1h" });

                res.status(201).json({ 
                    message: "User registered successfully", 
                    token,
                    user: { id: result.insertId, username, email }
                });
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const findUserQuery = "SELECT * FROM users WHERE email = ?";
        db.query(findUserQuery, [email], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length === 0) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const user = results[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({
                message: "Login successful",
                token,
                user: { id: user.id, username: user.username, email: user.email }
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/user", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "mySuperSecretKey"); // Decode token
        const findUserQuery = "SELECT id, username, email FROM users WHERE id = ?";

        db.query(findUserQuery, [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ user: results[0] });
        });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = router;
