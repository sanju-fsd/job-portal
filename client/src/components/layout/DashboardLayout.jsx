import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, role }) {
  return (
    <div className="min-h-screen bg-[#f5f7fc] pt-16">
      <div className="max-w-[1500px] mx-auto lg:flex">
        <Sidebar role={role} />
        <main className="flex-1 p-5 lg:p-8">
          <div className="bg-white/70 rounded-2xl border border-gray-200 p-4 lg:p-7 min-h-[78vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
