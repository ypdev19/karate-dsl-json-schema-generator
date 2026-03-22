import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown'; // For rendering Markdown content
import { useGlobalContext } from '../hooks/useGlobalContext';

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation(); // Access i18n for language detection and translations
  const { theme } = useGlobalContext(); // Get current theme (light/dark) for conditional styling
  const [content, setContent] = useState(''); // State to hold the loaded Markdown content
  const [loading, setLoading] = useState(true); // Loading state for UX feedback

  useEffect(() => {
    const loadContent = async () => {
      try {
        const lang = i18n.language;
        const response = await fetch(`/locales/privacyPolicy.${lang}.md`); // Fetch from public/
        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading Privacy Policy Markdown:', error);
        setContent(t('contentNotFound', { defaultValue: 'Content not available.' }));
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [i18n.language, t]);

  const markdownComponents = {
    a: ({ children, href }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={theme === 'dark' ? 'text-light' : 'text-primary'} // Theme-aware link styling
      >
        {children}
      </a>
    ),
  };

  // Show loading indicator while content is being fetched
  if (loading) {
    return (
      <Container fluid className={`py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="text-center">{t('loading')}</div>
      </Container>
    );
  }

  return (
    <Container fluid className={`py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <h1 className="text-center mb-4">{t('footer.privacyPolicy')}</h1> 
          <ReactMarkdown components={markdownComponents} className="markdown-content">
            {content}
          </ReactMarkdown>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;