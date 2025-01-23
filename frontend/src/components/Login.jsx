import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://multiplysystembackend-xc6o.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This is crucial for cookies to work
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verify the cookie is set
        document.location.href = "./";
        const cookies = document.cookie;
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="main-container flex justify-center items-center w-screen h-screen">
        <div className="login-box w-2/4 h-3/5 bg-white rounded-3xl flex">
          {/* Login Form */}
          <div className="login-form w-1/2 h-full text-center flex flex-col mt-20 items-center gap-10">
            <span className="text-4xl font-bold">Sign In</span>

            {error && (
              <div className="w-2/3 h-auto p-5 text-white font-semibold bg-red-500 rounded-lg">
                {error}
              </div>
            )}

            <form
              className="w-full h-[200px] flex flex-col justify-center items-center gap-6"
              onSubmit={handleLogin}
            >
              <input
                type="email"
                className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <input
                type="password"
                className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <a href="#" className="text-gray-600 hover:text-green-600">
                Forgot Your Password?
              </a>
              <button
                type="submit"
                className={`w-40 h-[40px] bg-green-600 text-white font-semibold rounded-lg 
                  ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>
          </div>

          {/* Welcome Box */}
          <div className="welcome-box login-form w-1/2 h-full text-center flex flex-col justify-center items-center gap-10 bg-green-600 rounded-tl-[30%] rounded-tr-3xl rounded-bl-[30%] rounded-br-3xl">
            <span className="text-4xl font-bold text-white">
              Hello, Friend!
            </span>
            <span className="text-lg font-semibold text-white">
              Register with your personal details to use all of site features
            </span>
            <button
              className="border-2 w-36 rounded-lg border-white text-white h-10 hover:bg-white hover:text-green-600 transition-colors"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
