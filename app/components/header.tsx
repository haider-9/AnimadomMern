import { LucideTv, Search, User, Menu, X, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState, useContext, useEffect } from "react";
import { FaSearch, FaRegTimesCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import RandomButton from "./randombutton";
import AuthContext from "~/context/AuthContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Default to dark theme
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isCurrentlyDark = savedTheme === 'dark';
      setIsDarkTheme(isCurrentlyDark);
      
      // Apply theme to document root
      document.documentElement.classList.toggle('light', !isCurrentlyDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    // Update document classes - we only need to toggle 'light' class
    // since dark is the default in our CSS
    document.documentElement.classList.toggle('light', !newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full py-4 px-4 md:px-6 flex justify-between items-center z-50 border-b mb-8 relative theme-transition">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <LucideTv className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold font-mono">
            <div className="sm:block hidden">アニマドム</div>
            <span className="sm:hidden">Animadom</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6 text-muted-foreground text-sm tracking-wide">
            <li>
              <Link
                to="/"
                className="hover:text-foreground transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/upcoming"
                className="hover:text-foreground transition-colors duration-200"
              >
                Upcoming
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                className="hover:text-foreground transition-colors duration-200"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/top_characters"
                className="hover:text-foreground transition-colors duration-200"
              >
                TopCharacters
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-foreground transition-colors duration-200"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hidden lg:block">
        <RandomButton />
      </div>
      {/* Right Section: Search + Actions */}
      <div className="flex items-center gap-4 w-full max-w-lg justify-end">
        {/* Theme Toggle - Desktop */}
        <div 
          onClick={toggleTheme}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full cursor-pointer relative overflow-hidden"
          title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
        >
          <div className="absolute inset-0 bg-zinc-800 dark:bg-zinc-700 opacity-20 rounded-full"></div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{ 
              rotateY: isDarkTheme ? 0 : 180,
              opacity: isDarkTheme ? 1 : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <Moon className="h-5 w-5 text-muted-foreground" />
          </motion.div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{ 
              rotateY: isDarkTheme ? 180 : 0,
              opacity: isDarkTheme ? 0 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <Sun className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Search Bar - Hide on small screens */}
        <div className="relative hidden lg:block">
          <div
            className={`flex items-center transition-all duration-300 ease-out ${
              isSearchExpanded
                ? "bg-secondary/50 border border-border rounded-full w-64"
                : "bg-transparent w-10"
            }`}
          >
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2.5 text-muted-foreground hover:text-foreground transition-colors ${
                isSearchExpanded ? "hidden" : "block"
              }`}
            >
              <FaSearch className="h-5 w-5" />
            </button>

            {isSearchExpanded && (
              <div className="flex-1 flex items-center">
                <FaSearch className="ml-4 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      navigate(`/search/${encodeURIComponent(search.trim())}`);
                      setIsSearchExpanded(false);
                      setSearch("");
                    }
                  }}
                  placeholder="Search..."
                  className="w-full px-3 py-2.5 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearch("");
                    setIsSearchExpanded(false);
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <FaRegTimesCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Buttons - Hide on small screens */}
        <div className="hidden lg:flex gap-2">
          {!isAuthenticated ? (
            <Link to="/getstarted">
              <Button size="sm">Get Started</Button>
            </Link>
          ) : null}
        </div>

        {/* User Profile Dropdown - Hide on small screens */}
        <div className="hidden lg:block">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                <Link to={`/user/${user?.name}`}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground p-6 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="size-16 rounded-full overflow-hidden">
                    <img src="/favicon.png" alt="favicon" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="h-5 w-5 text-sidebar-foreground" />
                  </Button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <div className="bg-sidebar-accent/10 border border-sidebar-border rounded-full w-full flex items-center">
                    <FaSearch className="ml-4 h-4 w-4 text-sidebar-foreground/60" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && search.trim()) {
                          navigate(
                            `/search/${encodeURIComponent(search.trim())}`
                          );
                          setIsSidebarOpen(false);
                          setSearch("");
                        }
                      }}
                      placeholder="Search..."
                      className="w-full px-3 py-2.5 bg-transparent text-sm text-sidebar-foreground placeholder-sidebar-foreground/60 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="mb-6">
                  <ul className="flex flex-col gap-4 text-sidebar-foreground/80 text-base">
                    <li>
                      <Link
                        to="/"
                        className="hover:text-sidebar-foreground transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/upcoming"
                        className="hover:text-sidebar-foreground transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Upcoming
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/collections"
                        className="hover:text-sidebar-foreground transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Collections
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/top_characters"
                        className="hover:text-sidebar-foreground transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Top Characters
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className="hover:text-sidebar-foreground transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                </nav>

                <RandomButton />
                
                {/* Theme Toggle - Mobile */}
                <div 
                  className="mt-4 flex items-center gap-2 text-sidebar-foreground/80 cursor-pointer"
                  onClick={toggleTheme}
                >
                  <div className="relative w-12 h-6 rounded-full overflow-hidden border border-sidebar-border">
                    <motion.div 
                      className="absolute inset-0 bg-sidebar-accent/20"
                      initial={false}
                      animate={{ 
                        x: isDarkTheme ? 0 : "100%" 
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                    <motion.div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-sidebar-foreground/90 flex items-center justify-center"
                      initial={false}
                      animate={{ 
                        x: isDarkTheme ? 0 : 24
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {isDarkTheme ? (
                        <Moon className="h-3 w-3 text-sidebar-accent" />
                      ) : (
                        <Sun className="h-3 w-3 text-sidebar-accent" />
                      )}
                    </motion.div>
                  </div>
                  <span>{isDarkTheme ? "Dark Mode" : "Light Mode"}</span>
                </div>
                
                {/* Mobile Auth */}
                <div className="mt-auto">
                  {!isAuthenticated ? (
                    <Link
                    to="/getstarted"
                    className="w-full block"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 text-sidebar-foreground/80">
                    <Link
                      to={`/user/${user?.name}`}
                      className="hover:text-sidebar-foreground transition-colors duration-200 py-2"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="hover:text-sidebar-foreground transition-colors duration-200 py-2"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      className="text-left hover:text-sidebar-foreground transition-colors duration-200 py-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
