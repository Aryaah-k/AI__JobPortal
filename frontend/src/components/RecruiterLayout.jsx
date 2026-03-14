import React from "react";
import RecruiterNavbar from "./RecruiterNavbar";

export default function RecruiterLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar at the top */}
      <RecruiterNavbar />

      {/* Page content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}