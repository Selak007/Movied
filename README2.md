# 🎬 Movied — A Letterboxd-Inspired Movie Review & Recommendation Platform

Movied is a full-stack web application inspired by [Letterboxd](https://letterboxd.com), built for cinephiles to discover, review, and track their favorite films. With a sleek interface and user-focused features, Movied makes it easy to share your opinions, manage your movie journey, and explore recommendations.

---

## 🚀 Features

- 🔍 **Movie Search Engine** — Find movies by title, genre, or keyword  
- ⭐ **5-Star Rating System** — Rate and review movies in detail  
- 📑 **Movie Detail Pages** — Rich movie pages with cast, genre, and descriptions  
- 💬 **User Reviews** — Post and browse user-generated reviews  
- 🎯 **Watchlist System** — Mark movies as _Watched_, _Watching_, or _Want to Watch_  
- 📱 **Responsive Design** — Works great on desktop, tablet, and mobile  
- 🔐 **Authentication** — Login/signup with secure localStorage-based auth  
- 🧠 **Recommendation Engine (coming soon)** — Smart suggestions based on your taste

---

## 🛠 Tech Stack

### Frontend
- **React** (with React Router & Axios)
- **TailwindCSS** for responsive and modern styling
- **Framer Motion** for smooth UI animations

### Backend
- **Node.js + Express**
- **MySQL** for movie, user, and review data
- **REST API** integration with TMDB (for movie data)

---

## 🧾 Folder Structure

DBMSProj/ ├── backend/ # Node.js + Express server ├── letterboxd-frontend/ # React-based frontend app ├── .gitignore └── README.md


---


---

## 🛠️ Getting Started

### 🔽 Clone the Repository

```bash
git clone https://github.com/Selak007/Movied.git
cd Movied
🧱 Setup the MySQL Database
1. Create a Database
Login to MySQL and run:

sql
Copy
Edit
CREATE DATABASE moviedb;

USE moviedb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE movies (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  genre VARCHAR(255),
  overview TEXT
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  movie_id INT,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  movie_id INT,
  status ENUM('watched', 'watching', 'want to watch'),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

⚙️ Backend Setup
1. Navigate to backend
bash
Copy
Edit
cd backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file inside /backend:

env
Copy
Edit
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moviedb
PORT=5000
4. Start the Backend Server
bash
Copy
Edit
npm start
Server will run on: http://localhost:5000

🎨 Frontend Setup
1. Navigate to frontend
bash
Copy
Edit
cd ../letterboxd-frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Start the Frontend App
bash
Copy
Edit
npm start
Frontend will run on: http://localhost:3000

🔗 API Overview
Method	Endpoint	Description
GET	/api/movies	Fetch all movies
GET	/api/movies/:id	Get movie by ID
POST	/api/reviews	Submit a review
GET	/api/reviews/:movie_id	Get reviews for a movie
POST	/api/watchlist	Add to watchlist
GET	/api/watchlist/:user_id	Fetch user's watchlist
🔐 Authentication
Basic login using frontend storage

JWT-based or OAuth login can be integrated later

🚧 Future Improvements
🔐 Full user authentication system

📊 User profile with review history

🤖 Smart recommendation engine

🌐 Multilingual support

🎭 Social features (followers, likes, etc.)

👨‍💻 Author
Built with ❤️ by Selak007

📄 License
This project is licensed under the MIT License

yaml
Copy
Edit

---

Let me know if you'd like:

- A version with badges (build status, tech logos)
- Sample `.env.example`
- Screenshots or demo video section

Want me to commit this directly to your repo too?
Update .env in backend/ with your MySQL credentials
