import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function RecruiterNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/recruiter/dashboard" },
    { name: "Create Job", path: "/recruiter/create-job" },
    { name: "My Jobs", path: "/recruiter/jobs" },
    { name: "Applications", path: "/recruiter/applications" },
    { name: "Ranked Candidates", path: "/recruiter/ranked-candidates" },
  ];

  const handleLogout = () => {
    if (!window.confirm("Logout from recruiter account?")) return;
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm
                ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg font-medium text-sm text-red-650 hover:bg-red-50 hover:text-red-700 transition flex items-center gap-1.5 self-end sm:self-auto border border-transparent hover:border-red-100"
      >
        <LogOut size={16} />
        Logout
      </button>
    </nav>
  );
}
