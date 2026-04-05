/**
 * App.jsx: ROUTING HUB - All pages share Navbar + Layout + Footer
 * Home: Original converter (100% unchanged)
 * New: About, Privacy, Terms, Changelog (dummy content)
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';  // ✅ NEW
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';  // ✅ NEW: Wraps original converter
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Changelog from './pages/Changelog';
import Layout from './components/Layout';  // ✅ NEW: Shared layout
import './index.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      
      <main className="flex-grow-1">
        <Container fluid className="main-content-container py-4">
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
            <Route path="/changelog" element={<Layout><Changelog /></Layout>} />
            <Route path="*" element={<Layout><Home /></Layout>} /> {/* 404 fallback */}
          </Routes>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;