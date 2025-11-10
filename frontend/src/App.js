import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VehicleList from './components/VehicleList';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="/listings">Listings</Link> | 
          <Link to="/chat">Chat</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Selamat Datang di Website Jual Beli Kendaraan Bekas</h1>} />
          <Route path="/listings" element={<VehicleList />} />
          <Route path="/chat" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;