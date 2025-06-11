import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b-4 border-green-700 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none">
          {/* Truck SVG icon */}
          <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <rect x="2" y="12" width="28" height="12" rx="3" fill="#217a2c" />
              <rect x="30" y="16" width="12" height="8" rx="2" fill="#217a2c" />
              <circle cx="10" cy="26" r="3" fill="#fff" stroke="#217a2c" strokeWidth="2" />
              <circle cx="36" cy="26" r="3" fill="#fff" stroke="#217a2c" strokeWidth="2" />
              <rect x="6" y="8" width="8" height="6" rx="2" fill="#217a2c" />
              <rect x="38" y="18" width="4" height="4" rx="1" fill="#fff" />
            </g>
          </svg>
          <span className="font-semibold text-lg text-green-900 leading-tight">
            My <span className="font-normal text-green-700">Cargonaut</span>
          </span>
        </Link>
        {/* Navigation Links & Auth Buttons */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-800 hover:text-green-700 font-medium">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/offers" className="text-gray-800 hover:text-green-700 font-medium">Drives</Link>
              <Link to="/chats" className="text-gray-800 hover:text-green-700 font-medium">Chats</Link>
              <Link to="/profile" className="text-gray-800 hover:text-green-700 font-medium">Profile</Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="ml-2 border-gray-400 text-gray-800 hover:text-green-700 hover:border-green-700"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="ml-2 border-gray-400 text-gray-800 hover:text-green-700 hover:border-green-700"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="default"
                  className="ml-2 bg-black text-white hover:bg-gray-800 rounded"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 