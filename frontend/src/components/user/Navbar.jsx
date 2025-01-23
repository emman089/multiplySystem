import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../../middleware/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isCheckingAuth: true,
    user: null,
    error: null,
  });

  const getActiveIndex = () => {
    switch (location.pathname) {
      case "/shop": return 1;
      case "/member-registration": return 2;
      case "/contact-us": return 3;
      default: return 0;
    }
  };

  const active = getActiveIndex();

  useEffect(() => {
    checkAuth(setAuthState);
  }, []);

  const handleClick = (route) => {
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isCheckingAuth: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-screen h-16 flex justify-between items-center">
      <div className="logo w-1/2">
        <img src={logo} className="w-1/3 m-2 h-16" alt="Logo" />
      </div>
      <div className="navlist w-1/2 flex justify-between items-center mx-10">
        <ul className="list flex w-1/2 gap-4 whitespace-nowrap font-bold">
          <li
            className={`cursor-pointer ${active === 0 ? "text-red-500" : ""}`}
            onClick={() => handleClick("/")}
          >
            Home
          </li>
          <li
            className={`cursor-pointer ${active === 1 ? "text-red-500" : ""}`}
            onClick={() => handleClick("/shop")}
          >
            Shop
          </li>
          <li
            className={`cursor-pointer ${active === 2 ? "text-red-500" : ""}`}
            onClick={() => handleClick("/member-registration")}
          >
            Be a Member?
          </li>
          <li
            className={`cursor-pointer ${active === 3 ? "text-red-500" : ""}`}
            onClick={() => handleClick("/contact-us")}
          >
            Contacts
          </li>
        </ul>
        <div className="cart">
          <div className="relative py-2">
            <div className="t-0 absolute left-3">
              <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                3
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="file: mt-4 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        </div>
        <div className="login">
          <div>
            {authState.isAuthenticated ? (
              <div className="flex justify-center items-center gap-5">
                <div className="flex justify-center items-center gap-2">
                  <img className="w-[35px] h-[35px]" src={avatar} alt="Avatar" />
                  <p className="font-semibold text-lg">
                    {authState.user?.firstName}
                  </p>
                </div>
                <button
                  className="w-24 h-12 rounded-lg font-bold bg-slate-900 text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="w-24 h-12 rounded-lg font-bold bg-slate-900 text-white"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;