import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const user = await login(form.email, form.password);

      setSuccess("Login successful 🎉");

      setTimeout(() => {
        if (user.role === "employer") {
          navigate("/employer-dashboard");
        } else {
          navigate("/find-jobs");
        }
      }, 800);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (

     

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
        

      <form
        onSubmit={submit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <div className="mx-auto px-4 bg-block">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
          </div>
          </div>
            <span className="text-black text-xl text-center font-bold">Welcome Back</span>
      </div>

        <h2 className="text-2xl font-bold text-center"></h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            name="email"
            placeholder="Email address"
            className="w-full pl-10 pr-3 py-3 border rounded-lg"
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 border rounded-lg"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3.5"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : "Login"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}