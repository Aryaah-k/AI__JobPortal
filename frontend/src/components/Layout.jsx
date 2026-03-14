import Navbar from "./Navbar";

export default function Layout({ children, variant = "default" }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-50">
      
      {/* Navbar (Hidden on auth pages like Login/Register) */}
      {variant !== "auth" && (
        <div className="sticky top-0 z-50 shadow-md">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div
          className={`mx-auto px-6 py-10 ${
            variant === "dashboard" ? "max-w-7xl" : "max-w-4xl"
          }`}
        >
          {children}
        </div>
      </main>

      {/* Footer (Hidden on auth pages) */}
      {variant !== "auth" && (
        <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AI Job Portal. All rights reserved.
        </footer>
      )}
    </div>
  );
}