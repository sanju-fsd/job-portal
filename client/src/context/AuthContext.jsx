import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "../pages/utils/axiosInstance";
import { API_PATHS } from "../pages/utils/apiPaths";

const AuthContext = createContext();

export const getDefaultRouteForRole = (role) => {
  if (role === "employer") return "/employer/dashboard";
  if (role === "candidate") return "/candidate/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await axios.get(API_PATHS.AUTH.PROFILE);
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(API_PATHS.AUTH.LOGIN, { email, password });

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await axios.post(API_PATHS.AUTH.REGISTER, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, loading, setUser, getDefaultRouteForRole }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
