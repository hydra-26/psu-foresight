import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Logo from "../assets/logo-blue.svg";

const SignIn = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const success = onLogin(email, password);
  //   if (!success) setError("Invalid email or password");
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await onLogin(email, password);
  if (!success) setError("Invalid email or password");
};


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full opacity-30 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full opacity-40 animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-50 animate-bounce"
          style={{ animationDuration: "3.5s" }}
        ></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl h-[90vh]">
          {/* Card container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 h-full">
            <div className="grid md:grid-cols-2 h-full">
              {/* Left side - Logo only with white background */}
              <div className="relative flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-full opacity-20 blur-3xl"></div>
                <div className="relative z-10 transform transition-all duration-500 hover:scale-105">
                  <img
                    src={Logo}
                    alt="PSU ForeSight"
                    className="w-80 mx-auto filter drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Right side - Sign In Form with #001F54 background + background image */}
              <div className="relative p-8 flex flex-col justify-center overflow-hidden" style={{ backgroundColor: "#001F54" }}>
                {/* ✅ Background image (added only this) */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-100"
                  style={{
                    backgroundImage:
                      "url('https://main.psu.edu.ph/wp-content/uploads/2022/06/psuschool.jpg')",
                  }}
                ></div>

                {/* Overlay to keep same blue color */}
                <div className="absolute inset-0 bg-[#001F54] opacity-90"></div>

                {/* Form Content */}
                <div className="relative z-10 max-w-md mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-1">
                      Welcome Back
                    </h2>
                    <p className="text-blue-200 text-sm">
                      Sign in to access your dashboard
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wide">
                        Email
                      </label>
                      <div className="relative group">
                        <div
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                            isFocused.email ? "text-blue-600" : "text-gray-400"
                          }`}
                        >
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          placeholder="admin@psu.edu.ph"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() =>
                            setIsFocused({ ...isFocused, email: true })
                          }
                          onBlur={() =>
                            setIsFocused({ ...isFocused, email: false })
                          }
                          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-0 focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover:border-blue-300 text-sm"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wide">
                        Password
                      </label>
                      <div className="relative group">
                        <div
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                            isFocused.password
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          <Lock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() =>
                            setIsFocused({ ...isFocused, password: true })
                          }
                          onBlur={() =>
                            setIsFocused({ ...isFocused, password: false })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit(e);
                            }
                          }}
                          className="w-full pl-11 pr-12 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-0 focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover:border-blue-300 text-sm"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded-xl animate-pulse">
                        <p className="text-red-700 text-xs font-semibold">
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Sign In Button */}
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group mt-5"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                        Sign In
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>

                    {/* Divider */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-blue-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span
                          className="px-3 text-blue-200"
                          style={{ backgroundColor: "#001F54" }}
                        >
                          or
                        </span>
                      </div>
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={onBack}
                      className="w-full flex items-center justify-center gap-2 py-3 text-white font-semibold hover:text-yellow-400 transition-all duration-200 group border-2 border-blue-300 rounded-xl hover:border-yellow-400 hover:bg-white/5 text-sm"
                    >
                      <ArrowLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform duration-200"
                      />
                      Back to Landing Page
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-blue-300">
                      Protected by PSU IT Security •
                      <span className="text-yellow-400 ml-1">Privacy Policy</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* end right side */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
