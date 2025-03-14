import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="text-white font-bold text-xl">
            Animadom
          </Link>

          {/* Core Links */}
          <div className="flex gap-6">
            <Link to="/top-rated" className="text-gray-400 hover:text-gray-200 transition-colors">Anime</Link>
            <Link to="/getstarted" className="text-gray-400 hover:text-gray-200 transition-colors">Community</Link>
            <Link to="/about" className="text-gray-400 hover:text-gray-200 transition-colors">About</Link>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
