import { useState, useEffect } from "react";
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-6 py-2 rounded-md font-semibold transition hover:shadow active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </button>
);


const Feature = ({ icon, title, description }) => (
  <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-md border hover:shadow-lg transition text-left">
    <div className="mb-3">{icon}</div>
    <h4 className="text-xl font-bold mb-2 text-gray-800">{title}</h4>
    <p className="text-gray-600 text-base">{description}</p>
  </div>
);


export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("token"));
  }, []);

  const logout = () => {
    document.cookie = "token =; expires=Thu, 01 Jan 1970 00:00:00 UTC; path =/"
    setIsLoggedIn(false)
  }


  return (
    <div className="relative min-h-screen font-sans bg-gray-50 text-gray-900 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-70" />

      {/* Content Layer */}
      <div className="relative z-10">
        <header className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-700">CollabBoard</h1>
          {!isLoggedIn && (
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => window.location.href = "/login"}
            >
              Login / Register
            </Button>
          )}
          {isLoggedIn && (
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => logout()}
            >
              Log Out
            </Button>
          )}
        </header>

        <section className="text-center py-24 px-6">
          <h2 className="text-6xl font-extrabold mb-4">Collaboration. Simplified.</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Manage tasks, assign intelligently, and sync with your team — in real time.
          </p>
          <Button
            className="bg-indigo-700 text-white hover:bg-indigo-800 px-8 py-3"
            onClick={() => window.location.href = isLoggedIn ? "/dashboard" : "/login"}
          >
            Get Started
          </Button>
        </section>

        <section className="max-w-7xl mx-auto py-20 grid md:grid-cols-3 gap-6 px-6">
          <Feature
            icon={
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 10h18M3 6h18M3 14h18M3 18h18" />
              </svg>
            }
            title="Live Collaboration"
            description="Instant updates across all devices with WebSocket-powered real-time sync."
          />
          <Feature
            icon={
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            }
            title="Smart Task Assignment"
            description="Automatically balance workloads based on team availability and priority."
          />
          <Feature
            icon={
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            }
            title="Conflict-Free Workflow"
            description="Built-in detection and resolution for concurrent edits and updates."
          />
        </section>

        <section className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">See It in Action</h3>
            <div className="bg-white p-4 rounded-xl shadow-lg space-y-3">
              <div className="bg-gray-200 p-3 rounded-md text-left shadow hover:scale-[1.02] transition">
                Setup Landing Page Design
              </div>
              <div className="bg-gray-200 p-3 rounded-md text-left shadow hover:scale-[1.02] transition">
                Integrate WebSocket Backend
              </div>
              <div className="bg-gray-200 p-3 rounded-md text-left shadow hover:scale-[1.02] transition">
                Refactor Auth Flow
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-indigo-700 text-white text-center px-6">
          <h3 className="text-3xl font-bold mb-4">Start Collaborating Smarter Today</h3>
          <Button
            className="bg-white text-indigo-700 font-bold hover:bg-gray-100 px-8 py-3"
            onClick={() => window.location.href = isLoggedIn ? "/dashboard" : "/login"}
          >
            Launch Board
          </Button>
        </section>

        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>© 2025 CollabBoard — <a href="#" className="underline">Privacy</a> • <a href="#" className="underline">Contact</a></p>
        </footer>
      </div>
    </div>
  );
}
