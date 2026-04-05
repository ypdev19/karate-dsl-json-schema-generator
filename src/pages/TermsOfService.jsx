import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useGlobalContext } from '../contexts/GlobalContext';

const TermsOfService = () => {
  const { theme, t, language } = useGlobalContext();  // ✅ language from context
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // ✅ DYNAMIC LANGUAGE: en.md or es.md
        const lang = language === 'es' ? 'es' : 'en';
        const response = await fetch(`/locales/termsOfService.${lang}.md`);
        if (!response.ok) throw new Error(`Failed to load ${lang} content`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading Terms of Service:', error);
        // Fallback to English
        try {
          const fallback = await fetch('/locales/termsOfService.en.md');
          setContent(await fallback.text());
        } catch {
          setContent('# Terms of Service\n\nContent not available.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [language]); // ✅ Re-runs when language changes

  // ... markdownComponents EXACTLY SAME (unchanged)
  const markdownComponents = {
    h1: ({ children }) => <h1 className={`fw-bold mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{children}</h1>,
    h2: ({ children }) => <h2 className={`mt-4 mb-3 fw-semibold ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{children}</h2>,
    h3: ({ children }) => <h3 className={`mt-3 mb-2 fw-semibold ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{children}</h3>,
    p: ({ children }) => <p className={`mb-3 ${theme === 'dark' ? 'text-light' : ''}`}>{children}</p>,
    strong: ({ children }) => <strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>{children}</strong>,
    em: ({ children }) => <em className="text-muted">{children}</em>,
    ul: ({ children }) => <ul className="mb-3 ps-4">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 ps-4">{children}</ol>,
    li: ({ children }) => <li className={`mb-1 ${theme === 'dark' ? 'text-light' : ''}`}>{children}</li>,
    a: ({ children, href }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-primary'} fw-semibold`}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className={`bg-${theme === 'dark' ? 'dark-subtle' : 'light'} p-1 rounded fw-mono small`}>
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`border-start border-3 ps-3 my-3 ${theme === 'dark' ? 'border-light' : 'border-primary'}`}>
        {children}
      </blockquote>
    )
  };

  if (loading) {
    return (
      <Row className="justify-content-center">
        <Col xs={12} className="text-center py-5">
          <div className={`spinner-border ${theme === 'dark' ? 'text-light' : 'text-primary'}`} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">{t('app.loading', { defaultValue: 'Loading...' })}</p>
        </Col>
      </Row>
    );
  }

  return (
    <div className="policy-content">
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default TermsOfService;