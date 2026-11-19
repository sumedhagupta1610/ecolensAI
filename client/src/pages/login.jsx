
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {

  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setMessage("");
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    setMessage("");

    if (isLoading) return;

    // SIGN UP VALIDATION

    if (isSignup) {

      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setMessage("Please fill in all the fields.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

    }

    // LOGIN VALIDATION

    if (!isSignup && (!formData.email.trim() || !formData.password)) {
      setMessage("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {

      // REGISTER API

      const endpoint = isSignup
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const requestBody = isSignup
        ? {
            full_name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password
          }
        : {
            email: formData.email.trim(),
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      // SAVE LOGIN DETAILS

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      // GO TO DASHBOARD

      navigate("/dashboard");

    } catch (error) {

      console.error("Authentication error:", error);

      setMessage(
        "Unable to connect to server. Please try again."
      );

    } finally {

      setIsLoading(false);

    }

  };


  return (

    <div className="login-container">

      <div className="login-box">

        <h1 className="logo">
          EcoLens AI
        </h1>

        <p className="tagline">
          Smart Waste Management, Recycling & Reuse Assistant
        </p>

        <h2>
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit}>

          {isSignup && (

            <div className="input-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

            </div>

          )}

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

          </div>

          {isSignup && (

            <div className="input-group">

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />

            </div>

          )}

          {message && (

            <p className="login-message">
              {message}
            </p>

          )}

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : isSignup
                ? "Sign Up"
                : "Login"}
          </button>

        </form>

        <div className="switch-account">

          {isSignup ? (

            <>
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setMessage("");
                }}
              >
                Login
              </button>
            </>

          ) : (

            <>
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setMessage("");
                }}
              >
                Sign Up
              </button>
            </>

          )}

        </div>

        {!isSignup && (

          <>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="guest-btn"
              onClick={() => navigate("/guest")}
            >
              Continue as Guest
            </button>

          </>

        )}

      </div>

    </div>

  );

};

export default Login;
