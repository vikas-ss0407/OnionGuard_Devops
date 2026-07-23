import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!validatePassword(form.password)) {
      alert(
        "Password must contain:\n- At least 1 uppercase letter\n- At least 1 number\n- At least 1 special character\n- Minimum length 5"
      );
      return;
    }

    try {
      const res = await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (res.message === "User already exists") {
        alert("Email already exists ❌");
        return;
      }

      if (res.user) {
        alert("Account created successfully ✅");
        navigate("/"); // Navigate to the login page (or wherever the main route is)
      } else {
        alert(res.message || "Signup failed");
      }
    } catch (err) {
      alert("Server error, try again");
      console.error(err);
    }
  };

  return (
    <div
      className="flex justify-between items-center h-[100vh] px-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/signup2.jpeg')" }}
    >
      {/* Left-side description container with white background */}
      <div className="hidden md:block w-1/2 p-10 bg-white rounded-lg text-gray-900 shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Create Your Account</h1>
        <p className="mb-4 text-lg">
          Join to efficiently manage your warehouse by monitoring environmental conditions and managing inventory and billing. Please follow the
          guidelines below:
        </p>
        <ul className="space-y-3 text-base">
          <li>✔ Use a valid email (must be unique)</li>
          <li>✔ Provide your real phone number</li>
          <li>✔ Password must include:</li>
          <ul className="ml-5 list-disc space-y-1">
            <li>At least 1 uppercase letter</li>
            <li>At least 1 number</li>
            <li>At least 1 special character (!@#$%^&*)</li>
            <li>Minimum length of 5 characters</li>
          </ul>
        </ul>
      </div>

      {/* Signup Form */}
      <form
        className="bg-white bg-opacity-90 p-10 rounded-lg shadow-lg w-96 md:w-[28rem]"
        onSubmit={handleSignup}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          Signup
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-3 mb-4 border rounded text-lg focus:border-blue-500 focus:ring-blue-500"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded text-lg focus:border-blue-500 focus:ring-blue-500"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel" // Changed to tel for semantic correctness
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 mb-4 border rounded text-lg focus:border-blue-500 focus:ring-blue-500"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded text-lg focus:border-blue-500 focus:ring-blue-500"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-3 mb-6 border rounded text-lg focus:border-blue-500 focus:ring-blue-500"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 mb-4 text-lg transition duration-200"
        >
          Signup
        </button>
        
        {/* Added "Already have an account? Login" button */}
        <p className="text-center mb-4 text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")} // Assuming '/' is your login page
            className="text-blue-700 font-semibold hover:text-blue-800 focus:outline-none"
          >
            Login
          </button>
        </p>

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