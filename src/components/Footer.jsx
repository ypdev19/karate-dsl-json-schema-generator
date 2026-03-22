/**
 * Footer.jsx: Copyright, Terms/Privacy links (theme-aware)
 */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useGlobalContext } from '../hooks/useGlobalContext';

const Footer = () => {
  const { theme } = useGlobalContext();
  
  const currentYear = new Date().getFullYear();
  const brandName = 'CodeQAZone';
  const termsHref = '/locales/termsOfService.en.md';
  const privacyHref = '/locales/privacyPolicy.en.md';

  return (
    <footer 
      className={`py-4 mt-auto ${theme}`} 
      style={{ borderTop: '1px solid #dee2e6' }}
      data-bs-theme={theme}
    >
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          <Col xs={12} md="auto" className="text-center text-md-start mb-3 mb-md-0">
            <small className="text-muted">
              © {currentYear}{' '}
              <a 
                href="https://www.codeqazone.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none fw-semibold"
              >
                {brandName}
              </a>
              . All rights reserved.
            </small>
          </Col>
          
          <Col xs={12} md="auto" className="text-center text-md-end">
            <small className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3">
              <a 
                href={termsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none small"
              >
                Terms of Service
              </a>
              <a 
                href={privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none small"
              >
                Privacy Policy
              </a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;