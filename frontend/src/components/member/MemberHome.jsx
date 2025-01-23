import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import profile from "../../assets/sample_profile.jpg";
import avatar from "../../assets/avatar.png";
import Footer from "../user/Footer";
import { checkMember } from "../../middleware/member";
import { checkMemberTransaction } from "../../middleware/memberTransaction";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Ensure this import is correct

const MemberHome = () => {
  // Declare useState hooks inside the functional component
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [MemberTransaction, setMemberTransaction] = useState(null);

  // Function to toggle visibility of the balance
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Format the amount based on visibility
  const formatAmount = (amount) => {
    if (isVisible) {
      return `₱ ${amount}`;
    }
    return `₱ ${"*".repeat(amount.toString().length)}`;
  };

  // Handle the copy of referral code to clipboard
  const handleCopy = () => {
    const referralCode = memberData?.referralCode;
    if (referralCode) {
      navigator.clipboard.writeText(referralCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  // Fetch member and transaction data on component mount
  useEffect(() => {
    checkMember(setMemberData);
    checkMemberTransaction(setMemberTransaction);
  }, []);

  // Log and safely access the data
  useEffect(() => {
    if (MemberTransaction && MemberTransaction.user) {
      console.log("User Price: ", MemberTransaction.user.price);
    } else {
      console.log("MemberTransaction or user is undefined");
    }
  }, [MemberTransaction]);

  // Return loading state if data is not available yet
  if (!memberData || !MemberTransaction || !MemberTransaction.user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-auto bg-slate-100 pb-10">
        <div className="details w-full h-56 flex flex-col justify-center items-center">
          <div className="memberProfile flex justify-between items-center gap-2">
            <img src={profile} alt="" className="w-14 h-14 rounded-full" />
            <p className="font-bold text-2xl">Ariel Labuson</p>
          </div>
          <div className="referral flex justify-between gap-6 pl-24 mt-8">
            <p className="font-bold flex gap-2">
              Referral:{" "}
              <span className="font-bold">{memberData.referralCode || "N/A"}</span>
            </p>
            <button
              className={`w-16 h-8 rounded-2xl font-bold border-2 flex items-center justify-center transition-all ${
                copied ? "bg-green-500 text-white" : ""
              }`}
              onClick={handleCopy}
            >
              {copied ? "✔" : "Copy"}
            </button>
          </div>
        </div>
        <div className="wallet-container w-full h-[260px] flex gap-14 justify-center text-white">
          {/* Wallet and Premium Container */}
          <div className="type-container w-[300px] h-48 rounded-lg bg-green-600 border-2 text-center">
            <p className="type text-2xl font-bold">{memberData.memberType || "N/A"}</p>
            <div className="referral flex justify-between mx-4 font-bold mt-6">
              <p>Referrals</p>
              <p>5</p>
            </div>
            <div className="available flex justify-between mx-4 font-bold mt-6">
              <p>Available Item</p>
              <p>100</p>
            </div>
            <div className="sold flex justify-between mx-4 font-bold mt-6">
              <p>Sold Item</p>
              <p>100</p>
            </div>
          </div>
          <div className="wallet w-[480px] h-72 rounded-lg bg-green-600 border-2">
            <div className="wallet-up flex justify-between items-center px-2">
              <div className="left">
                <p className="font-bold text-2xl">Wallet</p>
                <p>AVAILABLE BALANCE</p>
              </div>
              <div className="right">
                <button className="bg-slate-900 w-32 h-10 font-bold rounded-3xl shadow-lg">
                  Withdraw
                </button>
              </div>
            </div>
            <div className="balance flex justify-center items-center">
              <div className="value flex justify-center gap-2 items-center flex-col mt-6">
                <p className="font-bold text-md">TODAY</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-4xl">{formatAmount(MemberTransaction.totalIncomeToday)}</p>
                  <span
                    onClick={toggleVisibility}
                    className="cursor-pointer text-white hover:text-gray-800 transition-all"
                  >
                    {isVisible ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                  </span>
                </div>
                <p className="font-bold text-md">in {MemberTransaction.numberOfTransactionsToday} complete transactions</p>
                <p className="font-bold text-xl">Yesterday: {formatAmount(MemberTransaction.totalIncomeYesterday)}</p>
                <p className="font-bold text-xl">This Month: {formatAmount(MemberTransaction.totalIncomeThisMonth)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="referral-details w-full h-auto px-[15%] flex flex-col gap-10 text-white">
          <p className="text-2xl font-bold text-black">Referral List</p>
          <div className="cards-container w-full flex flex-wrap justify-start items-start gap-10 pl-20">
            {/* Referral Cards */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card w-[340px] h-80 rounded-lg gap-8 p-4 bg-green-600 border-2">
                <div className="ref_name flex items-center p-2 gap-2 font-bold text-xl">
                  <img src={avatar} alt="" />
                  <p>Juan Dela Cruz</p>
                </div>
                <div className="date flex justify-between m-2">
                  <p>Member Date</p>
                  <p className="font-bold">January 16, 2025</p>
                </div>
                <div className="date flex justify-between m-2">
                  <p>Contact</p>
                  <p className="font-bold">+639123456789</p>
                </div>
                <div className="date flex justify-between m-2">
                  <p>Address</p>
                  <p className="font-bold">
                    151 sample street, city/province Philippines
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MemberHome;
