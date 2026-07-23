import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res.user) {
        Cookies.set("user", JSON.stringify(res.user)); // ✅ session cookie
        alert("Logged in successfully");
        navigate("/dashboard");
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      alert("Server error, try again");
      console.error(err);
    }
  };

  return (
    <div
      className="flex justify-between items-center h-[100vh] px-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login2.jpeg')" }}
    >
      {/* Left side - Welcome section with white background */}
      <div className="hidden md:block w-1/2 p-12 bg-white bg-opacity-90 rounded-xl text-gray-900 shadow-lg">
        <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
        <p className="text-xl leading-relaxed mb-6">
          Log in to access your warehouse dashboard and manage inventory and sales billing efficiently.
        </p>
        <div className="mt-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded">
          <p className="font-semibold text-lg">🔒 Secured by OnionGuard</p>
          <p className="text-base">
            Your data security is our priority. Log in with confidence knowing your credentials are protected by OnionGuard multi-layered encryption protocol.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <form
        className="bg-white bg-opacity-90 p-10 rounded-lg shadow-lg w-96 md:w-[28rem]"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded text-lg focus:border-green-500 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded text-lg focus:border-green-500 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 mb-4 text-lg transition duration-200"
        >
          Login
        </button>

        {/* New User Sign Up Button */}
        <p className="text-center mb-4 text-gray-600">
          New user?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-green-700 font-semibold hover:text-green-800 focus:outline-none"
          >
            Sign up
          </button>
        </p>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-gray-400 text-gray-700 p-3 rounded-lg hover:bg-gray-300 text-lg transition duration-200"
        >
          ← Go Back
        </button>
      </form>
    </div>
  );
}
