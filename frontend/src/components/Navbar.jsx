import { Link, useLocation } from "react-router-dom";
import { Mail, BookmarkCheck, Briefcase } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Saved Jobs", path: "/saved-jobs" },
    { name: "Applied Jobs", path: "/applied-jobs" },
  ];

  return (
    <div className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl px-8 py-4 flex items-center justify-between shadow-lg">

        {/* Logo */}
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <div className="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            AI
          </div>
          AI JOB PORTAL
        </div>

        {/* Navigation */}
        <div className="flex gap-8 text-white font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative pb-1 hover:opacity-90 transition ${
                location.pathname === item.path
                  ? "border-b-2 border-white"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-white">

          <Link to="/messages">
            <Mail className="cursor-pointer hover:scale-110 transition" />
          </Link>

          <NotificationBell />

          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
              A
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}