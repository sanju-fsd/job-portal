import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

function Header( {openAuth}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================= MENU =================
  const menu = [
    { name: "Home", path: "/" },
    { name: "All Jobs", path: "/all-jobs" },
    { name: "Employer", path: "/employer-dashboard" },
    { name: "About", path: "/about" },
    { name: "Terms", path: "/terms" },
  ];

  const handleMenuClick = (item) => {
    if (item.name === "Employer") {
      navigate(user?.role === "employer" ? "/employer-dashboard" : "/employer");
    } else {
      navigate(item.path);
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Job Portal</span>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-6">
            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-6">
              {menu.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item)}
                  className="text-gray-600 hover:text-black font-medium"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* DESKTOP AUTH */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  {/* USER NAME */}
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="bg-gray-100 px-3 py-1.5 rounded-lg"
                  >
                    Hi, {user?.name || "User"}
                  </button>

                  {/* DROPDOWN */}
                  <AnimatePresence>
                    {dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border"
                      >
                        <button
                          onClick={() => navigate("/profile")}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        >
                          <User size={16} /> Profile
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button onClick={openAuth}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >Login</button>
                  
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-lg z-50 p-6"
          >
            {/* CLOSE */}
            <div className="flex justify-end mb-6">
              <button onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>

            {/* MENU LINKS */}
            <div className="flex flex-col gap-4">
              {menu.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleMenuClick(item);
                    setMenuOpen(false);
                  }}
                  className="text-left"
                >
                  {item.name}
                </button>
              ))}

              <hr />

              {!isAuthenticated ? (
                <>
                  <button onClick={openAuth}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="font-semibold"
                    onClick={() => navigate("/profile")}
                  >
                    {user?.name}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-red-500"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;