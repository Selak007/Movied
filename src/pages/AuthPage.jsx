import React, { useState } from "react";
import axios from "axios";
import "../styles/global.css";
import logo from "../assets/logo.png"; // Assuming you have a logo image

export default function AuthPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
      const response = await axios.post(url, formData);
      
      setMessage(isLogin ? "Login successful!" : "Registration successful!");
  
      if (!isLogin) {
        const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password
        });
  
        localStorage.setItem("token", loginResponse.data.token);
        window.location.href = "/home";
      } else {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/home";
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-box">
          <img src={logo} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>
          {message && <p className="auth-message">{message}</p>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input type="text" name="username" placeholder="Username" onChange={handleChange} className="auth-input" required />
            )}
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="auth-input" required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="auth-input" required />
            <button type="submit" className="auth-button">{isLogin ? "Login" : "Register"}</button>
          </form>
          <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}
