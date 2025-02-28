import { LucideTv, Search, User } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center z-50 border-b">
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
          <ul className="flex gap-6 text-neutral-300 text-sm uppercase tracking-wide">
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
        <div className="hidden lg:flex items-center relative">
          <Input
            placeholder="Search anime..."
            className="w-48 bg-neutral-800/50 border-neutral-700 text-white placeholder-neutral-400 focus:ring-1 focus:ring-cyan-500 rounded-md pr-8"
          />
          <Search className="h-4 w-4 text-neutral-400 absolute right-2" />
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
    </header>
  );
}
