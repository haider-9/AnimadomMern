import { LucideTv, Search, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState, useContext } from "react";
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
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full py-4 px-4 md:px-6 flex justify-between items-center z-50 border-b mb-8 relative">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <LucideTv className="h-6 w-6 text-pink-400" />
          <h1 className="text-xl font-semibold font-mono text-white">
            <div className="sm:block hidden">アニマドム</div>
            <span className="sm:hidden">Animadom</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6 text-neutral-300 text-sm tracking-wide">
            <li>
              <Link
                to="/"
                className="hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/upcoming"
                className="hover:text-white transition-colors duration-200"
              >
                Upcoming
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                className="hover:text-white transition-colors duration-200"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/top_characters"
                className="hover:text-white transition-colors duration-200 
                "
              >
                TopCharacters
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-white transition-colors duration-200"
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
        {/* Search Bar - Hide on small screens */}
        <div className="relative hidden lg:block">
          <div
            className={`flex items-center transition-all duration-300 ease-out ${
              isSearchExpanded
                ? "bg-white/5 border border-white/10 rounded-full w-64"
                : "bg-transparent w-10"
            }`}
          >
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2.5 text-gray-400 hover:text-white transition-colors ${
                isSearchExpanded ? "hidden" : "block"
              }`}
            >
              <FaSearch className="h-5 w-5" />
            </button>

            {isSearchExpanded && (
              <div className="flex-1 flex items-center">
                <FaSearch className="ml-4 h-4 w-4 text-gray-400" />
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
                  className="w-full px-3 py-2.5 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearch("");
                    setIsSearchExpanded(false);
                  }}
                  className="p-2 text-gray-400 hover:text-white"
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
                  <User className="h-5 w-5 text-neutral-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-900 border-neutral-800 text-white">
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
            <X className="h-5 w-5 text-neutral-300" />
          ) : (
            <Menu className="h-5 w-5 text-neutral-300" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-neutral-900 p-6 shadow-xl"
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
                    <X className="h-5 w-5 text-neutral-300" />
                  </Button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-full w-full flex items-center">
                    <FaSearch className="ml-4 h-4 w-4 text-gray-400" />
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
                      className="w-full px-3 py-2.5 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="mb-6">
                  <ul className="flex flex-col gap-4 text-neutral-300 text-base">
                    <li>
                      <Link
                        to="/"
                        className="hover:text-white transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/upcoming"
                        className="hover:text-white transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Upcoming
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/collections"
                        className="hover:text-white transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Collections
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/top_characters"
                        className="hover:text-white transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Top Characters
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className="hover:text-white transition-colors duration-200 block py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                </nav>

                <RandomButton />
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
                    <div className="mt-4 flex flex-col gap-2 text-neutral-300">
                      <Link
                        to={`/user/${user?.name}`}
                        className="hover:text-white transition-colors duration-200 py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="hover:text-white transition-colors duration-200 py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Settings
                      </Link>
                      <button 
                        className="text-left hover:text-white transition-colors duration-200 py-2"
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
