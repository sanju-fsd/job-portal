import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, X, User,Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, getDefaultRouteForRole } from "../../../context/AuthContext";

function Header({ openAuth }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    { name: "Home", path: "/" },
    { name: "All Jobs", path: "/jobs" },
    {
      name: "Dashboard",
      path: user ? getDefaultRouteForRole(user.role) : "/login",
    },
  ];

  const profilePath =
    user?.role === "employer"
      ? "/employer/company-profile"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : "/candidate/profile";

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Job Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {menu.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="text-gray-600 hover:text-black font-medium"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="bg-gray-100 px-3 py-1.5 rounded-lg"
                  >
                    Hi, {user?.name || "User"}
                  </button>

                  <AnimatePresence>
                    {dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200"
                      >
                        <button
                        
                          onClick={() => {navigate(profilePath);
                                          setDropdown(false);}}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        >
                          <User size={16} /> Profile
                        </button>

                        <button
                          onClick={() => {
                              setDropdown(false);
                              handleLogout();
                            }}
                          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                        >
                          <Power size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={openAuth}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Login
                </button>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(true)}>
              <Menu />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-lg z-50 p-6"
          >
            <div className="flex justify-end mb-6">
              <button onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {menu.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="text-left"
                >
                  {item.name}
                </button>
              ))}

              <hr />

              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    openAuth();
                    setMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Login
                </button>
              ) : (
                <>
                  <button className="font-semibold" onClick={() => navigate(profilePath)}>
                    {user?.name}
                  </button>

                  <button onClick={handleLogout} className="text-red-500">
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
