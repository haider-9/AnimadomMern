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
  ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
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
  const location = useLocation();
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
          {!isSearchExpanded ? (
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="p-3 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-secondary/30 hover:bg-secondary/50"
            >
              <FaSearch className="h-4 w-4" />
            </button>
          ) : (
            <motion.div
              className="absolute right-0 top-0 flex items-center rounded-full bg-secondary/30 hover:bg-secondary/50 px-4 py-2 w-72 shadow-lg border border-border z-50"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <FaSearch className="h-4 w-4 text-muted-foreground mr-3" />
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
                onBlur={() => {
                  if (!search.trim()) {
                    setIsSearchExpanded(false);
                  }
                }}
                placeholder="Search anime..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
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

      {/* Mobile Menu Overlay - Portfolio2.0 Style */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] bg-background overflow-y-auto"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="min-h-screen flex flex-col p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-foreground w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center hover:bg-secondary/50 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center"
                  whileHover={{ rotate: 15 }}
                >
                  <LucideTv className="h-5 w-5" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-bebas text-xl tracking-tight uppercase leading-none">
                    ANIMADOM
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.3em] text-primary uppercase">
                    アニメ
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    className="w-full bg-secondary/30 border border-border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="mb-8 flex-1">
                <ul className="flex gap-4 flex-col">
                  {[
                    { name: "Home", href: "/" },
                    { name: "Trending", href: "/trending" },
                    { name: "Top Rated", href: "/top-rated" },
                    { name: "Upcoming", href: "/upcoming" },
                    { name: "Characters", href: "/top_characters" },
                    { name: "Collections", href: "/collections" },
                    { name: "About", href: "/about" },
                  ].map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-3xl sm:text-4xl font-bebas hover:text-primary transition-all duration-500 uppercase flex items-center gap-3 group"
                      >
                        {item.name}{" "}
                        <ArrowUpRight className="opacity-0 group-hover:opacity-100 w-6 h-6 transition-opacity" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Random Button */}
              <div className="mb-6">
                <RandomButton />
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <motion.button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    {isDarkTheme ? (
                      <>
                        <Moon className="h-4 w-4" /> DARK
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4" /> LIGHT
                      </>
                    )}
                  </motion.button>

                  {!isAuthenticated ? (
                    <Link
                      to="/getstarted"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Button className="bg-primary text-primary-foreground font-bebas text-xs tracking-widest px-5 py-2 rounded-full hover:scale-105 transition-transform">
                        GET STARTED
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex gap-3 text-xs">
                      <Link
                        to={`/user/${user?.name}`}
                        onClick={() => setIsSidebarOpen(false)}
                        className="font-bold uppercase tracking-widest hover:text-primary transition-colors"
                      >
                        PROFILE
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="font-bold uppercase tracking-widest hover:text-destructive transition-colors"
                      >
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-[0.3em]">
                    &copy;{new Date().getFullYear()} ANIMADOM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
