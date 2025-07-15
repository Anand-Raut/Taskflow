import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import mail_icon from "../assets/mail_icon.svg";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const API_BASE = "http://localhost:4000/api/";
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const sendOtp = async () => {
      try {
        setSending(true);
        const res = await fetch(API_BASE + "auth/send-verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) {
          setMessage("Failed to send OTP. Try again later.");
        }
      } catch (err) {
        setMessage("Error sending OTP.");
      } finally {
        setSending(false);
      }
    };
    sendOtp();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE + "auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (data.success) {
        navigate("/");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative">
      <img
        src={logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer"
      />
      <div className="flex flex-col items-center bg-white bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
        <p className="text-base text-gray-700 mb-6">
          {sending ? "Sending OTP..." : "Enter the OTP sent to your email"}
        </p>
        <form className="w-full" onSubmit={handleVerify}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={mail_icon} alt="mail" />
            <input
              className="bg-transparent outline-none text-white flex-1"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-3 rounded-b-md bg-indigo-700 text-white py-2 font-semibold"
          >
            Verify
          </button>
        </form>
        <p className="text-red-600 mt-4">{message}</p>
      </div>
    </div>
  );
};

export default EmailVerify;
