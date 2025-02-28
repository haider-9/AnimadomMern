import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="backdrop-blur-sm bg-white/20 w-[70%] top-4 left-1/2 -translate-x-1/2 fixed z-50 p-2 flex items-center justify-evenly rounded-full shadow-lg">
      <div className="size-16 rounded-full overflow-hidden">
        <img
          src="https://dummyimage.com/500x500"
          alt="Logo"
          className="object-center object-cover"
        />
      </div>
      <ul className="flex items-center gap-4 ">
        <Link to="/" className="text-white hover:text-gray-300 transition">
          Home
        </Link>
        <Link to="/about" className="text-white hover:text-gray-300 transition">
          About
        </Link>
        <Link
          to="/collections"
          className="text-white hover:text-gray-300 transition"
        >
          Collections
        </Link>
        <Link
          to="/top-char"
          className="text-white hover:text-gray-300 transition"
        >
          Top Characters
        </Link>
        <Link
          to="/upcoming"
          className="text-white hover:text-gray-300 transition"
        >
          Upcoming
        </Link>
      </ul>
      <div className="flex items-center gap-2">
        <div className="size-12 rounded-full overflow-hidden ">
          <img
            src="https://dummyimage.com/500x500"
            alt="profile picture"
            className="object-center object-cover"
          />
        </div>
        <h2>NameUser</h2>
      </div>
    </div>
  );
};

export default Navbar;
