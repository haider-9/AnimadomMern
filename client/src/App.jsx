import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Anime from './pages/Anime';

const App = () => {
  return (
    <Router> 
      <Navbar />
      <main className="mt-10">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/anime/:animeId" element={<Anime />} />

      </Routes>
      </main>
    </Router>
  );
};

export default App;
