import { LucideTv, User, Menu, X, Moon, Sun } from "lucide-react";
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
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isCurrentlyDark = savedTheme === "dark";
      setIsDarkTheme(isCurrentlyDark);
      document.documentElement.classList.toggle("light", !isCurrentlyDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.documentElement.classList.toggle("light", !newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsSidebarOpen(false);
  };

  return (
    <div className="sticky top-0 backdrop-blur-md bg-background/80 w-full py-3 px-4 md:px-8 flex items-center justify-between z-50 border-b theme-transition">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <LucideTv className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">
            <div className="sm:block hidden">アニマドム</div>
            <span className="sm:hidden">Animadom</span>
          </h1>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex gap-8 text-sm font-medium">
            {[ "Upcoming", "Collections", "Top Characters", "About"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase().replace(" ", "_")}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:block">
          <RandomButton />
        </div>

        <div className="relative hidden lg:block">
          <div className={`flex items-center rounded-full bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 ${isSearchExpanded ? "w-72" : "w-10"}`}>
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-3 text-muted-foreground hover:text-foreground transition-colors ${isSearchExpanded ? "hidden" : "block"}`}
            >
              <FaSearch className="h-4 w-4" />
            </button>

            {isSearchExpanded && (
              <div className="flex-1 flex items-center px-4 py-2">
                <FaSearch className="h-4 w-4 text-muted-foreground" />
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
                  placeholder="Search anime..."
                  className="w-full px-3 bg-transparent text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearch("");
                    setIsSearchExpanded(false);
                  }}
                  className="p-1 hover:text-foreground text-muted-foreground"
                >
                  <FaRegTimesCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary/30 transition-colors"
        >
          {isDarkTheme ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {!isAuthenticated ? (
          <Link to="/getstarted" className="hidden lg:block">
            <Button size="sm" variant="default">Get Started</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/30">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to={`/user/${user?.name}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-72 bg-sidebar p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="size-14 rounded-full overflow-hidden">
                    <img src="/favicon.png" alt="logo" className="w-full h-full object-cover" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="bg-sidebar-accent/10 rounded-full flex items-center">
                    <FaSearch className="ml-4 h-4 w-4 opacity-60" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && search.trim()) {
                          navigate(`/search/${encodeURIComponent(search.trim())}`);
                          setIsSidebarOpen(false);
                          setSearch("");
                        }
                      }}
                      placeholder="Search anime..."
                      className="w-full px-3 py-3 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <nav className="mb-8">
                  <ul className="space-y-4">
                    {["Home", "Upcoming", "Collections", "Top Characters", "About"].map((item) => (
                      <li key={item}>
                        <Link
                          to={`/${item.toLowerCase().replace(" ", "_")}`}
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <RandomButton />

                <div className="mt-6 flex items-center gap-3 cursor-pointer" onClick={toggleTheme}>
                  <div className="w-12 h-6 rounded-full bg-sidebar-accent/20 relative">
                    <motion.div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary"
                      animate={{ x: isDarkTheme ? 0 : 24 }}
                    />
                  </div>
                  <span className="text-sm">{isDarkTheme ? "Dark Mode" : "Light Mode"}</span>
                </div>

                <div className="mt-auto">
                  {!isAuthenticated ? (
                    <Link
                      to="/getstarted"
                      className="block w-full"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to={`/user/${user?.name}`}
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="w-full text-left py-2 hover:text-primary transition-colors"
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