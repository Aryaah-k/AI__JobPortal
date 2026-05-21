import { useEffect } from "react";
import Navbar from "./Navbar";
import api from "../api";

export default function Layout({ children, variant = "default" }) {
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api.get("applications/candidate/")
        .then((res) => {
          const appliedIds = res.data.map((app) => app.job_detail?.id || app.job);
          localStorage.setItem("appliedJobs", JSON.stringify(appliedIds));
        })
        .catch((err) => {
          console.error("Error syncing applied jobs in layout:", err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-150 to-gray-50 font-sans antialiased text-gray-800">
      
      {/* Navbar (Hidden on auth pages like Login/Register) */}
      {variant !== "auth" && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div
          className={`mx-auto px-4 sm:px-6 py-8 ${
            variant === "dashboard" ? "max-w-7xl" : "max-w-5xl"
          }`}
        >
          {children}
        </div>
      </main>

      {/* Footer (Hidden on auth pages) */}
      {variant !== "auth" && (
        <footer className="bg-white border-t py-6 text-center text-sm text-gray-550 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Job Portal. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition">Support</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}