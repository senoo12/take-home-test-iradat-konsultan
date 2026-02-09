import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-white bg-blue-600 px-3 py-2 rounded-md font-semibold transition-all shadow-sm"
      : "text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md transition-all";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm mb-6">
      <div className="px-8 mx-auto"> 
        <div className="flex h-16 items-center justify-between">          
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Salary Management Iradat
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <Link className={isActive("/")} to="/">
              Home
            </Link>
            <Link className={isActive("/consoler")} to="/consoler">
              Consolers
            </Link>
            <Link className={isActive("/event")} to="/event">
              Events
            </Link>
            <Link className={isActive("/attendance")} to="/attendance">
              Attendances
            </Link>
            <Link className={isActive("/salary")} to="/salary">
              Salaries
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;