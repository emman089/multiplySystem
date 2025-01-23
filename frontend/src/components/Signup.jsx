import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Password validation regex (at least 9 characters, upper and lower case, number, and special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,}$/;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 9 characters long and include uppercase, lowercase, numbers, and special characters. example:(1234Juan@)"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://multiplysystembackend-xc6o.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This is crucial for cookies to work
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/verification");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container flex justify-center items-center w-screen h-screen">
      <div className="login-box w-2/4 min-h-3/5 bg-white rounded-3xl flex">
        <div className="welcome-box login-form w-1/2 text-center flex flex-col justify-center items-center gap-10 bg-green-600 rounded-tr-[30%] rounded-tl-3xl rounded-br-[30%] rounded-bl-3xl">
          <span className="text-4xl font-bold text-white">Welcome Back!</span>
          <span className="text-lg font-semibold text-white ">
            Enter your personal details to use all of site features
          </span>
          <button
            className="border-2 w-36 rounded-lg border-white text-white h-10"
            onClick={() => navigate("/login")}
          >
            SIGN IN
          </button>
        </div>
        <div className="login-form w-1/2 h-full text-center flex flex-col mt-20 items-center gap-5">
          <span className="text-4xl font-bold">Sign In</span>
          {error && (
            <div className="w-2/3 h-auto p-5 text-white font-semibold bg-red-500 rounded-lg">
              {error}
            </div>
          )}
          <form
            className="w-full h-[400px] flex flex-col justify-center items-center gap-6"
            onSubmit={handleSignup}
          >
            <input
              type="text"
              className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
              placeholder="First Name"
              required
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
              placeholder="Last Name"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
              placeholder="Create Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-2/3 h-[40px] bg-gray-200 rounded-lg indent-5"
              required
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-40 h-[40px] bg-green-600 text-white font-semibold rounded-lg flex justify-center items-center"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading? (
                <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin "></div>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
