import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserCheck,
  Building2,
  Loader,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAuthForm from "./useAuthForm";

export default function AuthModal({ open, onClose }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState("login");

  const {
    form,
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
  } = useAuthForm({
    login,
    register,
    navigate,
    onSuccess: (user, target) => {
      onClose();
      navigate(target);
    },
  });

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    await submitLogin();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    await submitSignup();
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          className="absolute top-3 right-3 text-gray-500"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="flex border-b mb-4">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                clearMessages();
              }}
              className={`flex-1 py-2 font-medium ${
                tab === t
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {t === "login" ? "Login" : "Signup"}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex gap-2 text-red-600 bg-red-50 p-2 rounded text-sm mb-3">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div className="flex gap-2 text-green-600 bg-green-50 p-2 rounded text-sm mb-3">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input icon={<Mail />} name="email" placeholder="Email" onChange={change} />
            <Password show={showPass} setShow={setShowPass} onChange={change} />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              {loading ? <Loader className="animate-spin mx-auto" /> : "Login"}
            </button>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <Input icon={<User />} name="name" placeholder="Full name" onChange={change} />
            <Input icon={<Mail />} name="email" placeholder="Email" onChange={change} />
            <Password show={showPass} setShow={setShowPass} onChange={change} />

            <div className="grid grid-cols-2 gap-2">
              <RoleBtn
                active={form.role === "candidate"}
                icon={<UserCheck size={16} />}
                label="Candidate"
                onClick={() => setRole("candidate")}
              />
              <RoleBtn
                active={form.role === "employer"}
                icon={<Building2 size={16} />}
                label="Employer"
                onClick={() => setRole("employer")}
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              {loading ? <Loader className="animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
    <input {...props} className="w-full pl-10 py-3 border rounded-lg" />
  </div>
);

const Password = ({ show, setShow, onChange }) => (
  <div className="relative">
    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
    <input
      type={show ? "text" : "password"}
      name="password"
      placeholder="Password"
      onChange={onChange}
      className="w-full pl-10 pr-10 py-3 border rounded-lg"
    />
    <button
      type="button"
      className="absolute right-3 top-3"
      onClick={() => setShow(!show)}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

const RoleBtn = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 py-2 rounded-lg border ${
      active ? "bg-blue-600 text-white" : "bg-white text-gray-600"
    }`}
  >
    {icon}
    {label}
  </button>
);
