import { Briefcase, Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import AnimatedBriefcase from "../ui/Logo";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check and update user state
    const checkUserState = () => {
      try {
        const user = localStorage.getItem("currentUser");
        if (user) {
          setCurrentUser(JSON.parse(user));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Check user state immediately
    checkUserState();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        checkUserState();
      }
    };

    // Listen for custom events (when user logs in/out in same tab)
    const handleUserChange = () => {
      checkUserState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userStateChanged', handleUserChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChanged', handleUserChange);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('userStateChanged'));
    
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Don't render auth buttons while loading
  if (isLoading) {
    return (
      <nav className="bg-gray-50 sticky top-0 z-50 shadow-sm rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center" onClick={handleClick}>
                <AnimatedBriefcase />
                <span className="ml-4 text-xl font-bold text-gray-900 hover:scale-120 transition ease-in-out duration-500">
                  JobHub
                </span>
              </Link>
              <div className="hidden md:flex md:ml-6 md:space-x-4">
                <Link
                  to="/jobs" onClick={handleClick}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 rounded-md transition  hover:scale-110"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/post-job" onClick={handleClick}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 rounded-md transition hover:scale-110"
                >
                  Post a Job
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex md:items-center md:space-x-4">
                <div className="animate-pulse bg-gray-200 h-9 w-20 rounded"></div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="ml-2 md:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-50 sticky top-0 z-50 shadow-sm rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Desktop Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={handleClick}>
              <AnimatedBriefcase />
              <span className="ml-4 text-xl font-bold text-gray-900 hover:scale-120 transition ease-in-out duration-500">
                JobHub
              </span>
            </Link>
            <div className="hidden md:flex md:ml-6 md:space-x-4">
              <Link
                to="/jobs" onClick={handleClick}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 rounded-md transition  hover:scale-110"
              >
                Browse Jobs
              </Link>
              <Link
                to="/post-job" onClick={handleClick}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 rounded-md transition hover:scale-110"
              >
                Post a Job
              </Link>
            </div>
          </div>

          {/* Auth Buttons (desktop) + Mobile Hamburger */}
          <div className="flex items-center">
            {/* desktop auth */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.name}
                    </span>
                  </div>
                  <Link to="/profile" onClick={handleClick}>
                    <Button variant="blue" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={handleClick}>
                    <Button variant="blue">Login</Button>
                  </Link>
                  <Link to="/register" onClick={handleClick}>
                    <Button variant="danger">Register</Button>
                  </Link>
                </>
              )}
            </div>
            {/* mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="ml-2 md:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/jobs"
              onClick={toggleMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Browse Jobs
            </Link>
            <Link
              to="/post-job"
              onClick={toggleMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Post a Job
            </Link>
            
            {currentUser ? (
              <div className="px-3 py-2 space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{currentUser.name}</span>
                </div>
                <Link
                  to="/profile"
                  onClick={toggleMobileMenu}
                  className="w-full"
                >
                  <Button
                    variant="blue"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 mt-4 px-4">
                <Button
                  onClick={() => {
                    navigate("/login");
                    toggleMobileMenu();
                  }}
                  variant="blue"
                >
                  Login
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    navigate("/register");
                    toggleMobileMenu();
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;