import { Link, useLocation } from "react-router-dom";

export default function RecruiterNavbar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/recruiter" },
    { name: "Create Job", path: "/recruiter/create-job" },
    { name: "My Jobs", path: "/recruiter/jobs" },
    { name: "Applications", path: "/recruiter/applications" },
  ];

  return (
    <nav className="bg-white shadow-md p-4 rounded-xl mb-6 flex space-x-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`px-4 py-2 rounded-lg font-medium transition
              ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
