import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


export default function Login() {

  const navigate = useNavigate();

  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!emailPrefix || !password) return alert("Enter credentials");

    const fullEmail = emailPrefix.trim().includes("@")
      ? emailPrefix.trim()
      : `${emailPrefix.trim()}@fraudshield.in`;




    try {
      const res = await fetch(`${API_BASE_URL}/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: fullEmail, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", data.name);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

return (
    <div className="min-h-screen flex bg-[#06090f] text-white gap-12">

      {/* LEFT */}
      <div className="flex-1 flex flex-col justify-center px-12 pl-20">

        <div className="max-w-xl">

          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
              UPI
            </div>
            <p className="text-sm text-gray-400">FraudShield</p>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Fraud<span className="text-blue-500">Shield</span>
          </h1>

          <p className="text-gray-400 mb-8">
            AI-Powered UPI Fraud Detection
          </p>

          <div className="space-y-4 text-sm">
            <Feature text="3 ML Models: IsolationForest, LR, RandomForest" color="bg-blue-500" />
            <Feature text="Risk scored: High / Medium / Low per transaction" color="bg-yellow-500" />
            <Feature text="Real data: 1.27M+ transactions analysed" color="bg-green-500" />
          </div>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center">

        <div className="w-[480px] bg-[#0f172a]/70 backdrop-blur-xl p-10 rounded-2xl border border-[#1e2535] shadow-2xl">

          <h2 className="text-xl font-semibold mb-1">Sign In</h2>
          <p className="text-gray-400 text-sm mb-6">
            Access your fraud detection platform
          </p>

          {/* Email with fixed domain */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Email</p>
            <div className="flex items-center bg-[#1e2535] p-3 rounded-lg">
              <input
                type="text"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value)}
                placeholder="username"
                className="flex-1 bg-transparent outline-none text-white"
              />
              <span className="text-gray-400">@fraudshield.in</span>
            </div>
          </div>

          {/* Password with visibility toggle */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Password</p>
            <div className="flex items-center bg-[#1e2535] p-3 rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 bg-transparent outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white ml-2"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.333 6.545A9.956 9.956 0 003 10c0 3.183 1.385 6.057 3.728 8.015l3.726-3.318z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 py-3 rounded-lg mt-2"
          >
            Sign In
          </button>

        </div>

      </div>
    </div>
  );
}

function Feature({ text, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <p className="text-gray-300">{text}</p>
    </div>
  );
}
