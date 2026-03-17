import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  FileText,
  Users,
  User,
  Bookmark,
  ShieldCheck,
  Power
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const employerMenu = [
    { label: "User Dashboard", icon: LayoutDashboard, path: "/employer/dashboard" },
    { label: "Profile", icon: User, path: "/employer/company-profile" },
    { label: "My Jobs", icon: Briefcase, path: "/employer/jobs" },
    { label: "Submit Job", icon: PlusCircle, path: "/employer/jobs/new" },
    // { label: "Applicants Jobs", icon: FileText, path: "/employer/jobs" },
    // { label: "Candidate Alerts", icon: Bell, path: "/employer/jobs" },
  ];

  const candidateMenu = [
    { label: "User Dashboard", icon: LayoutDashboard, path: "/candidate/dashboard" },
    { label: "Profile", icon: User, path: "/candidate/profile" },
    { label: "Find Jobs", icon: Briefcase, path: "/jobs" },
    { label: "Saved Jobs", icon: Bookmark, path: "/candidate/saved-jobs" },
    // { label: "Applications", icon: FileText, path: "/candidate/applications" },
    // { label: "Messages", icon: MessageSquare, path: "/candidate/applications" },
  ];

  const adminMenu = [
    { label: "Admin Dashboard", icon: ShieldCheck, path: "/admin/dashboard" },
    { label: "Jobs", icon: FileText, path: "/admin/jobs" },
    { label: "Employers", icon: Briefcase, path: "/admin/employers" },
    { label: "Candidates", icon: Users, path: "/admin/candidates" },
  ];

  const menu = role === "admin" ? adminMenu : role === "employer" ? employerMenu : candidateMenu;

  return (
    <aside className="w-full lg:w-80 bg-white border-r border-gray-200 p-6 lg:min-h-[calc(100vh-64px)] flex flex-col justify-between">

  {/* Top Section */}
  <div className="space-y-7 sticky top-20">
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center bg-gray-100">
        {user?.profileImageUrl ? (
          <img
            src={`https://job-portal-1hxq.onrender.com${user.profileImageUrl}`}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-10 h-10 text-gray-500" />
        )}
      </div>

      <div>
        <p className="font-semibold text-2xl capitalize">
          {user?.name || role}
        </p>
        <p className="text-sm text-gray-500 capitalize">{role}</p>
      </div>
    </div>

    <nav className="space-y-2">
      {menu.map((item) => {
        const active =
          location.pathname === item.path ||
          (item.path !== "/" && location.pathname.startsWith(item.path));

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition 
              ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <item.icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>


  {/* Bottom Logout */}
  <div className="border-t pt-4 flex ">
    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      className="flex items-center gap-2 text-red-500 hover:text-red-600"
      >
      <Power size={18} /> Logout
    </button>
    </div>

    </div>
</aside>
  );
}
