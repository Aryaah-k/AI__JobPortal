import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, User, LogOut, ChevronDown, Menu, X, Briefcase, Bookmark, Building, Heart, MessageSquare, Compass } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const usernameRaw = localStorage.getItem("username");
  const username = (usernameRaw || "User").trim();

  const initials = username
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Briefcase },
    { name: "Jobs", path: "/jobs", icon: Compass },
    { name: "Companies", path: "/companies", icon: Building },
    { name: "Saved Jobs", path: "/saved-jobs", icon: Bookmark },
    { name: "Applied Jobs", path: "/applied-jobs", icon: Heart },
    { name: "Messages", path: "/messages", icon: MessageSquare },
  ];

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            JP
          </div>
          <span className="font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
            Job Portal
          </span>
        </Link>

        {/* CENTER: Navigation (desktop) */}
        <nav className="hidden xl:flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-650 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-3">

          {/* messages */}
          <Link
            to="/messages"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
            title="Messages"
          >
            <Mail size={20} />
          </Link>

          {/* notifications */}
          <NotificationBell />

          {/* profile */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {initials}
              </div>

              <ChevronDown
                size={14}
                className={`text-gray-500 transition-transform duration-200 ${
                  showMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-150 rounded-xl shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {username}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-650 hover:bg-gray-50 transition"
                  >
                    <User size={16} className="text-gray-400" />
                    My Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* mobile menu button */}
          <button
            className="xl:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}