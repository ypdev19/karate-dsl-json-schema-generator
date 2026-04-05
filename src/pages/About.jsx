import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';

const About = () => {
  const { t, theme } = useGlobalContext();

  return (
    <div className="page-section">
      <h1 className={`mb-4 fw-bold ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
        {t('about.title', { defaultValue: 'About Karate JSON Schema Converter' })}
      </h1>
      
      <div className="about-content">
        <p className="lead mb-4">
          Client-side tool that converts JSON payloads to Karate DSL validation schemas.
        </p>
        
        <div className="row g-4">
          <div className="col-md-6">
            <h3>✨ Features</h3>
            <ul className="list-unstyled">
              <li className="mb-2">• 100% offline, no backend</li>
              <li className="mb-2">• Real-time type inference</li>
              <li className="mb-2">• Theme switching (Dark/Light)</li>
              <li className="mb-2">• Multi-language (EN/ES)</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>🚀 Tech Stack</h3>
            <ul className="list-unstyled">
              <li className="mb-2">• React 18 + Vite</li>
              <li className="mb-2">• React Bootstrap 5</li>
              <li className="mb-2">• Ace Editor (syntax highlighting)</li>
              <li>• 100% client-side conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;