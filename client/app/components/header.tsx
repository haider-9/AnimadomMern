import { LucideTv, Search, User } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import { FaSearch, FaRegTimesCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const handleSearch = () => {
    if (search.trim()) {
    } else {
    }
  };
  return (
    <div className="w-full py-4 px-6 flex justify-between items-center z-50 border-b">
      {/* Left Section: Logo + Nav */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <LucideTv className="h-6 w-6 text-pink-400" />{" "}
          {/* Anime-inspired TV icon */}
          <h1 className="text-xl font-semibold font-mono text-white">
            {/* Animadom */}
            <ruby>
              アニマドム<rt>Animadom</rt>
            </ruby>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:block">
          {" "}
          {/* Hide on mobile, show on medium+ screens */}
          <ul className="flex gap-6 text-neutral-300 text-sm tracking-wide">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/upcoming" className="hover:text-white">
                Upcoming
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-white">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Section: Search + Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
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
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Log In
        </Button>
        <Button size="sm">Get Started</Button>
      </div>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5 text-neutral-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-neutral-900 border-neutral-800 text-white">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
