import './loader.css';
export default function loader() {
    return (
        <div className="loader flex justify-center items-center h-screen">
           <div data-glitch="Loading..." className="glitch">Loading...</div>
        </div>
    );
  }
  