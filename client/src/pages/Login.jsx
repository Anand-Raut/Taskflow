import { useState } from "react";
import logo from "../assets/logo.svg";
import person_icon from "../assets/person_icon.svg";
import mail_icon from "../assets/mail_icon.svg";
import lock_icon from "../assets/lock_icon.svg";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../../server/controller/userController";

const Login = () => {
  const API_BASE = "http://localhost:4000/api/"; // Change if your backend runs elsewhere
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = state === "Sign Up" ? "auth/register" : "auth/login";
      const res = await fetch(API_BASE + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      console.log("success: "+ data.success)
      if (data.success) {
        const verified = await fetch(API_BASE + "user/data",{
          method: "GET",
          headers: {"Content-Type" :"application/json"},
          credentials: "include",
        })
        const verifyData = await verified.json();
        let isVerified = false;
        if (verifyData.success){
          isVerified = verifyData.userData.isAccountVerified;
        }
        if (!isVerified){
          navigate("/email-verify")
        }
        else{
          navigate("/"); 
        }
        
        

      }else{
        setMessage("Incorrect details / User already exists")
      }

    } catch (err) {
      console.log("Network error: "+ err.message);
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
        <h1 className="text-3xl font-bold mb-2">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h1>
        <p className="text-base text-gray-700 mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>
        <form className="w-full" onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={person_icon} alt="" />
              <input
                className="bg-transparent outline-none text-white flex-1"
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={mail_icon} alt="" />
            <input
              className="bg-transparent outline-none text-white flex-1"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={lock_icon} alt="" />
            <input
              className="bg-transparent outline-none text-white flex-1"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-3 rounded-b-md bg-indigo-700 text-white py-2 font-semibold"
          >
            {state}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-700">
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                className="text-indigo-700 cursor-pointer font-semibold"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <span
                className="text-indigo-700 cursor-pointer font-semibold"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
};

export default Login;
