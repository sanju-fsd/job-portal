import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.name || !form.email || !form.password) {
    return setError("Please fill all fields");
  }

  try {
    setLoading(true);

    await register(form); // send JSON

    setSuccess("Account created successfully ");
    setTimeout(() => navigate("/login"), 1200);

  } catch (err) {
    setError(err.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        {/* Alerts */}
        {error && (
          <div className="flex gap-2 text-red-600 bg-red-50 p-2 rounded-lg text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="flex gap-2 text-green-600 bg-green-50 p-2 rounded-lg text-sm">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            name="name"
            placeholder="Full name"
            className="w-full pl-10 py-3 border rounded-lg"
            onChange={change}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            name="email"
            placeholder="Email"
            className="w-full pl-10 py-3 border rounded-lg"
            onChange={change}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 border rounded-lg"
            onChange={change}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3.5"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Role */}
        <div className="grid grid-cols-2 gap-3">
          <RoleBtn
            active={form.role === "candidate"}
            icon={<UserCheck size={18} />}
            label="Candidate"
            onClick={() => setForm({ ...form, role: "candidate" })}
          />
          <RoleBtn
            active={form.role === "employer"}
            icon={<Building2 size={18} />}
            label="Employer"
            onClick={() => setForm({ ...form, role: "employer" })}
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center gap-2">
          {loading ? <Loader className="animate-spin" size={18} /> : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

/* Role Button */
function RoleBtn({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}