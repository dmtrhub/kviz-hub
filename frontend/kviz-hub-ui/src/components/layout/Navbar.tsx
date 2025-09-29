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
    <nav className="bg-white shadow-lg border-b border-gray-100 fixed w-full z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
              <FaTrophy className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KvizHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            {/* Regular Navigation ONLY for Non-Admin Users */}
            {user &&
              user.role !== "Admin" &&
              userNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActiveRoute(item.path)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100"
                  }`}
                >
                  <item.icon
                    className={`text-sm transition-transform group-hover:scale-110 ${
                      isActiveRoute(item.path) ? "text-white" : "text-gray-400"
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/25 font-medium"
                  >
                    <FaCog className="text-sm" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 px-4 py-2 rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <FaUserCircle
                          className={`text-xl transition-colors ${
                            user.role === "Admin"
                              ? "text-purple-500"
                              : "text-blue-500"
                          }`}
                        />
                        {user.role === "Admin" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
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
                            ? "bg-purple-100 text-purple-700 border-purple-200"
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
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-3 z-10 backdrop-blur-sm bg-white/95">
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
                              ? "bg-purple-100 text-purple-700 border-purple-200"
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
                            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            onClick={() => setProfileOpen(false)}
                          >
                            <FaList className="mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl shadow-blue-500/25 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all duration-200 font-medium hover:scale-105"
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
              className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-2.5 rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {menuOpen ? (
                <FaTimes className="w-5 h-5 text-gray-600" />
              ) : (
                <FaBars className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-2xl backdrop-blur-sm bg-white/95">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Regular Navigation ONLY for Non-Admin Users */}
            {user &&
              user.role !== "Admin" &&
              userNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium group"
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span>{item.label}</span>
                </Link>
              ))}

            {user ? (
              <>
                {/* Admin Section - Only for Admin */}
                {user.role === "Admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-600 font-semibold"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCog className="text-purple-500" />
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
                          ? "bg-purple-100 text-purple-700 border-purple-200"
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
                  className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-center shadow-lg shadow-blue-500/25"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium text-center"
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
