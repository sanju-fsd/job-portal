import { useState } from "react";
import toast from "react-hot-toast";
import { getDefaultRouteForRole } from "../../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "candidate",
};

export default function useAuthForm({ login, register, navigate, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const change = (e) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setRole = (role) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, role }));
  };

  const submitLogin = async () => {
    if (!form.email || !form.password) {
      setError("Email and password are required");
      toast.error("Email and password are required");
      return null;
    }

    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      setSuccess("Login successful");
      toast.success("Login successful");

      const target = getDefaultRouteForRole(user.role);
      if (onSuccess) onSuccess(user, target);
      else navigate(target);

      return user;
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Login failed";
      setError(errMsg);
      toast.error(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      toast.error("Please fill all fields");
      return null;
    }

    try {
      setLoading(true);
      const user = await register(form);
      setSuccess("Account created successfully");
      toast.success("Account created successfully");

      const target = getDefaultRouteForRole(user.role);
      if (onSuccess) onSuccess(user, target);
      else navigate(target);

      return user;
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Signup failed";
      setError(errMsg);
      toast.error(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    showPass,
    setShowPass,
    loading,
    error,
    success,
    change,
    setRole,
    submitLogin,
    submitSignup,
    setError,
    setSuccess,
  };
}
