import { LayoutDashboard, PlusCircle, Briefcase, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const employerMenu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/employer-dashboard" },
    { label: "Post Job", icon: PlusCircle, path: "/post-job" },
    { label: "Manage Jobs", icon: Briefcase, path: "/manage-jobs" },
    { label: "Company Profile", icon: User, path: "/company-profile" },
  ];

  const candidateMenu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/candidate-dashboard" },
    { label: "Browse Jobs", icon: Briefcase, path: "/find-jobs" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const menu = role === "employer" ? employerMenu : candidateMenu;

  return (
    <aside className="w-64 bg-white border-r border-gray-300 p-5 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Logo */}
                  <div
                    className="flex items-center space-x-3  cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-black text-xl font-bold space-y-5">Job Portal</span>

                  </div>

        <nav className="space-y-5 hover: ">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex items-center gap-2 text-red-500"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}