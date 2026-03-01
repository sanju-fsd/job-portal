import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold">Welcome back!</h1>
        <p className="text-sm text-gray-500">
          Here’s what’s happening with your account today.
        </p>
      </div>

      <div className="text-right">
        <p className="font-medium">{user?.name}</p>
        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
      </div>
    </div>
  );
}