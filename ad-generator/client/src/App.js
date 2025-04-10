import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UploadAd from './pages/UploadAd';
import GenerateResults from './pages/GenerateResults';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadAd />} />
            <Route path="/results" element={<GenerateResults />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
