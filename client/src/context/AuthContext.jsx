import { createContext, useContext, useEffect, useState } from "react";
import axios from "../pages/utils/axiosInstance";
import { API_PATHS } from "../pages/utils/apiPaths";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile if token exists
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const { data } = await axios.get(API_PATHS.AUTH.PROFILE);
        setUser(data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const { data } = await axios.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  //  REGISTER 
const register = async (formData) => {
  const { data } = await axios.post(
    API_PATHS.AUTH.REGISTER,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  localStorage.setItem("token", data.token);
  setUser(data.user);
  return data.user;
};

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);