import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="backdrop-blur-sm bg-white/30 w-full  p-2 flex items-center justify-evenly rounded-full my-3 mx-auto ">
      <div className="size-20 rounded-full overflow-hidden logo  ">
        <img
          src="https://dummyimage.com/500x500"
          alt=""
          className="object-center object-cover"
        />
      </div>
      <div className="flex items-center gap-4 links">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
