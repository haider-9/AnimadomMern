import {
  LucideTv,
  User,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
  Home,
  Calendar,
  LibrarySquare,
  Sword,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState, useContext, useEffect } from "react";
import { FaSearch, FaRegTimesCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import RandomButton from "./randombutton";
import AuthContext from "~/context/AuthContext";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

// Anime-themed icons for navigation
const navIcons = {
  Home: <Home className="h-4 w-4" />,
  Upcoming: <Calendar className="h-4 w-4" />,
  Collections: <LibrarySquare className="h-4 w-4" />,
  "Top Characters": <Sword className="h-4 w-4" />,
  About: <Info className="h-4 w-4" />,
};

export default function Header() {
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isHoveringTheme, setIsHoveringTheme] = useState(false);
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
    <div className="w-full py-3 px-4 md:px-8 flex items-center justify-between z-50 border-b theme-transition relative">
      {/* Anime sparkle effect when theme changes */}
      <AnimatePresence>
        {isHoveringTheme && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute text-primary"
                initial={{
                  x: Math.random() * 40 - 20,
                  y: Math.random() * 40 - 20,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                  ease: "easeInOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <LucideTv className="h-7 w-7 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold relative">
            <div className="sm:block hidden">アニマドム</div>
            <span className="sm:hidden">Animadom</span>
            {/* Underline animation */}
            <motion.span
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </h1>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex gap-6 text-[12px] font-medium">
            {["Home", "Upcoming", "Collections", "Top Characters", "About"].map(
              (item) => (
                <motion.li
                  key={item}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item == "Home" ? (
                    <Link
                      to={"/"}
                      className="hover:text-primary transition-colors duration-200 flex items-center gap-2"
                    >
                      {navIcons[item]} Home
                    </Link>
                  ) : (
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "_")}`}
                      className="hover:text-primary transition-colors duration-200 flex items-center gap-2"
                    >
                      {navIcons[item]}
                      {item}
                    </Link>
                  )}
                </motion.li>
              )
            )}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:block">
          <RandomButton />
        </div>

        <div className="relative hidden lg:block">
          <div
            className={`flex items-center rounded-full bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 ${
              isSearchExpanded ? "w-72" : "w-10"
            }`}
          >
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-3 text-muted-foreground hover:text-foreground transition-colors ${
                isSearchExpanded ? "hidden" : "block"
              }`}
            >
              <FaSearch className="h-4 w-4" />
            </button>

            {isSearchExpanded && (
              <motion.div
                className="flex-1 flex items-center px-4 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
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
              </motion.div>
            )}
          </div>
        </div>

        <motion.button
          onClick={toggleTheme}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary/30 transition-colors relative overflow-hidden"
          onHoverStart={() => setIsHoveringTheme(true)}
          onHoverEnd={() => setIsHoveringTheme(false)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            key={isDarkTheme ? "moon" : "sun"}
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            {isDarkTheme ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
        </motion.button>

        {!isAuthenticated ? (
          <Link to="/getstarted" className="hidden lg:block">
            <Button
              size="sm"
              variant="default"
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <motion.span
                className="absolute inset-0 bg-primary/20 z-0"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-secondary/30 relative"
                >
                  <User className="h-5 w-5" />
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border-border"
            >
              <Link to={`/user/${user?.name}`}>
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-destructive"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </DropdownMenuItem>
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
              className="absolute right-0 top-0 h-full w-72 bg-sidebar p-6 border-l border-border"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    className="size-14 rounded-full overflow-hidden border-2 border-primary"
                    whileHover={{ rotate: 15 }}
                  >
                    <img
                      src="/favicon.png"
                      alt="logo"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
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
                  <div className="bg-sidebar-accent/10 rounded-full flex items-center border border-border">
                    <FaSearch className="ml-4 h-4 w-4 opacity-60" />
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
                      placeholder="Search anime..."
                      className="w-full px-3 py-3 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <nav className="mb-8">
                  <ul className="flex gap-8 flex-col text-sm font-medium">
                    {[
                      "Home",
                      "Upcoming",
                      "Collections",
                      "Top Characters",
                      "About",
                    ].map((item) => (
                      <motion.li
                        key={item}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item == "Home" ? (
                          <Link
                            to={"/"}
                            className="hover:text-primary transition-colors duration-200 flex items-center gap-2"
                          >
                            {navIcons[item]} Home
                          </Link>
                        ) : (
                          <Link
                            to={`/${item.toLowerCase().replace(" ", "_")}`}
                            className="hover:text-primary transition-colors duration-200 flex items-center gap-2"
                          >
                            {navIcons[item]}
                            {item}
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <RandomButton />

                <div
                  className="mt-6 flex items-center gap-3 cursor-pointer"
                  onClick={toggleTheme}
                >
                  <div className="w-12 h-6 rounded-full bg-sidebar-accent/20 relative">
                    <motion.div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary"
                      animate={{ x: isDarkTheme ? 0 : 24 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                    />
                  </div>
                  <span className="text-sm flex items-center gap-2">
                    {isDarkTheme ? (
                      <>
                        <Moon className="h-4 w-4" /> Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4" /> Light Mode
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-auto">
                  {!isAuthenticated ? (
                    <Link
                      to="/getstarted"
                      className="block w-full"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Button className="w-full group">
                        <span className="relative z-10">Get Started</span>
                        <motion.span
                          className="absolute inset-0 bg-primary/20 z-0"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to={`/user/${user?.name}`}
                        className="block py-2 hover:text-primary transition-colors flex items-center gap-3"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block py-2 hover:text-primary transition-colors flex items-center gap-3"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                      <button
                        className="w-full text-left py-2 hover:text-destructive transition-colors flex items-center gap-3"
                        onClick={handleLogout}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
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
