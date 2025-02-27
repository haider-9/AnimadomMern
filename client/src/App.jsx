import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/About';

const App = () => {
  return (
    <Router> 
      <Navbar />
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
