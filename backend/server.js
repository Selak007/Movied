require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");
const watchlistRoutes = require("./routes/watchlist")


const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);

app.use("/api/reviews", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));
