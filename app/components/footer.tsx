import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-6 sm:gap-4">
          {/* Brand */}
          <Link to="/" className="text-white font-bold text-xl rounded-full overflow-hidden size-13">
            <img src="/favicon.png" alt="favicon" />
          </Link>

          {/* Core Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/top-rated" className="text-gray-400 hover:text-gray-200 transition-colors">Anime</Link>
            <Link to="/getstarted" className="text-gray-400 hover:text-gray-200 transition-colors">Community</Link>
            <Link to="/about" className="text-gray-400 hover:text-gray-200 transition-colors">About</Link>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}