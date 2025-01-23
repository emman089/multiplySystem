import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function generateCustomString() {
  const prefix = "MUL";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;

  for (let i = 0; i < 21; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const Membership = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isCheckingAuth: true, // Start true since we check on load
    user: null,
    error: null,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch(
        `http://localhost:5174/api/auth/check-auth`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isCheckingAuth: false,
        error: error.message,
      });
    }
  };

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const referralCode = generateCustomString();
  const memberID = authState.user?._id;
  const [memberType, setMemberType] = useState("");
  const [addressNo, setAddressNo] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [referredBy, setReferredBy] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [selectedBarangayName, setSelectedBarangayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const date =  new Date();

  // Options for formatting the date
  const options = { year: 'numeric', month: 'long', day: 'numeric' ,  timeZone: 'Asia/Manila' };
  
  // Format the date using Intl.DateTimeFormat
  const memberDate = new Intl.DateTimeFormat('en-US', options).format(date);

  useEffect(() => {
    checkAuth();
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://psgc.gitlab.io/api/provinces/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
    setLoading(false);
  };

  const fetchCities = async (provinceCode) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
      );
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
    setLoading(false);
  };

  const fetchBarangays = async (cityCode) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`
      );
      const data = await response.json();
      setBarangays(data);
    } catch (error) {
      console.error("Error fetching barangays:", error);
    }
    setLoading(false);
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const provinceName =
      provinces.find((province) => province.code === provinceCode)?.name || "";
    setSelectedProvince(provinceCode);
    setSelectedProvinceName(provinceName);
    setCities([]);
    setBarangays([]);
    if (provinceCode) {
      fetchCities(provinceCode);
    }
  };

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    const cityName = cities.find((city) => city.code === cityCode)?.name || "";
    setSelectedCity(cityCode);
    setSelectedCityName(cityName);
    setBarangays([]);
    if (cityCode) {
      fetchBarangays(cityCode);
    }
  };

  const handleBarangayChange = (e) => {
    const barangayCode = e.target.value;
    const barangayName =
      barangays.find((barangay) => barangay.code === barangayCode)?.name || "";
    setSelectedBarangay(barangayCode);
    setSelectedBarangayName(barangayName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (termsAccepted) {
      // Process form submission here
      console.log("Form submitted successfully");
    }

    setIsLoading(true);
    setError("");
    if (authState.isAuthenticated) {
      try {
        const response = await fetch(
          "https://multiplysystembackend.onrender.com/api/member/create-member",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // This is crucial for cookies to work
            body: JSON.stringify({
              referralCode,
              memberID,
              memberType,
              addressNo,
              province: selectedProvinceName,
              city: selectedCityName,
              barangay: selectedBarangayName,
              paymentType,
              referredBy,
              memberDate
            }),
          }
        );
        const data = await response.json();

        if (response.ok) {
          // Verify the cookie is set
          document.location.href = "./";
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }else{
    window.location.href = "./login"
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-20">
        <h2 className="text-xl font-semibold mb-6">Be a Member</h2>
        {error && (
          <div className="w-2/3 h-auto p-5 text-white font-semibold bg-red-500 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membership Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}
            >
              <option value=""></option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address No.
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="House/Building Number"
              onChange={(e) => setAddressNo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedProvince}
              onChange={handleProvinceChange}
              disabled={loading}
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/Municipality
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedProvince || loading}
            >
              <option value="">Select City/Municipality</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barangay
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedBarangay}
              onChange={handleBarangayChange}
              disabled={!selectedCity || loading}
            >
              <option value="">Select Barangay</option>
              {barangays.map((barangay) => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Payment
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => setPaymentType(e.target.value)}
              value={paymentType}
            >
              <option value=""></option>
              <option value="Gcash">GCash</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral Code No.
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => setReferredBy(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              I have agreed to the{" "}
              <span className="text-blue-600">terms and conditions</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!termsAccepted}
            className={`w-full bg-green-500 text-white py-2 px-4 rounded-md transition-all duration-200 ${
              termsAccepted
                ? "hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                : "opacity-75 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Membership;
