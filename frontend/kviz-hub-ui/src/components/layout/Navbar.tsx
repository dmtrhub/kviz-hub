import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaTrophy,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaList
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const userNavItems = [
    { path: "/quizzes", label: "Quizzes", icon: FaTrophy },
    { path: "/leaderboard", label: "Leaderboard", icon: FaCog },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-slate-700 p-2.5 shadow-lg shadow-slate-700/25 ring-1 ring-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl">
              <FaTrophy className="text-white text-lg" />
            </div>
            <span className="bg-gradient-to-r from-blue-500 to-slate-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              KvizHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Regular Navigation ONLY for Non-Admin Users */}
            {user &&
              user.role !== "Admin" &&
              userNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActiveRoute(item.path)
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/90 hover:text-slate-900"
                  }`}
                >
                  <item.icon
                    className={`text-sm transition-transform group-hover:scale-110 ${
                      isActiveRoute(item.path) ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

            {user ? (
              <>
                {/* Admin Panel Link - Only for Admin */}
                {user.role === "Admin" && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                      isActiveRoute("/admin")
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                        : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/90 hover:text-slate-900"
                    }`}
                  >
                    <FaCog
                      className={`text-sm transition-transform group-hover:scale-110 ${
                        isActiveRoute("/admin") ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <FaUserCircle
                          className={`text-xl transition-colors ${
                            user.role === "Admin"
                              ? "text-slate-600"
                              : "text-blue-500"
                          }`}
                        />
                        {user.role === "Admin" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-700">
                        {user.username}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          user.role === "Admin"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                      <FaChevronDown
                        className={`text-gray-400 text-xs transition-transform duration-200 ${
                          profileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 z-10 mt-3 w-72 rounded-2xl border border-slate-200 bg-white/95 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.email}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            user.role === "Admin"
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      {/* User Menu Items - ONLY FOR REGULAR USERS */}
                      {user.role !== "Admin" && (
                        <div className="py-2">
                          <Link
                            to="/my-results"
                            className="group flex items-center px-4 py-2.5 text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => setProfileOpen(false)}
                          >
                            <FaList className="mr-3 text-slate-400 transition-colors group-hover:text-blue-500" />
                            <span>My Results</span>
                          </Link>
                        </div>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <FaSignOutAlt className="mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Register for Non-Authenticated */
              <div className="flex space-x-3 ml-4">
                <Link
                  to="/login"
                  className="btn-primary rounded-xl px-5 py-2.5 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary rounded-xl border-2 px-5 py-2.5 font-medium hover:border-blue-400 hover:scale-105 hover:text-blue-600 hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="rounded-xl border border-slate-200 bg-white/80 p-2.5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/60"
            >
              {menuOpen ? (
                <FaTimes className="h-5 w-5 text-slate-600" />
              ) : (
                <FaBars className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Regular Navigation ONLY for Non-Admin Users */}
            {user &&
              user.role !== "Admin" &&
              userNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center space-x-3 rounded-xl px-4 py-3 font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="text-slate-400 transition-colors group-hover:text-blue-500" />
                  <span>{item.label}</span>
                </Link>
              ))}

            {user ? (
              <>
                {/* Admin Section - Only for Admin */}
                {user.role === "Admin" && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${
                      isActiveRoute("/admin")
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCog
                      className={
                        isActiveRoute("/admin") ? "text-slate-200" : "text-slate-400"
                      }
                    />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Info & Logout */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-3 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    <span
                      className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        user.role === "Admin"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
                  >
                    <FaSignOutAlt className="text-red-500 group-hover:scale-110 transition-transform" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              /* Mobile Login/Register */
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-3">
                <Link
                  to="/login"
                  className="btn-primary block rounded-xl px-4 py-3 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary block rounded-xl border-2 px-4 py-3 text-center font-medium hover:border-blue-400 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
