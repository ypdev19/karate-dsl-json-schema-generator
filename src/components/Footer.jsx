import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // ✅ Internal links
import { useGlobalContext } from '../contexts/GlobalContext';

const Footer = () => {
  const { theme, t } = useGlobalContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-4 mt-auto ${theme}`} style={{ borderTop: '1px solid #dee2e6' }} data-bs-theme={theme}>
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          <Col xs={12} md="auto" className="text-center text-md-start mb-3 mb-md-0">
            <small className="text-muted">
              {t('footer.copyrightPrefix', { year: currentYear })}
              <a 
                href="https://www.codeqazone.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none fw-semibold"
              >
                {t('footer.brandName')}
              </a>
              {t('footer.copyrightSuffix')}
            </small>
          </Col>
          
          <Col xs={12} md="auto" className="text-center text-md-end">
            <small className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3">
              <Link to="/terms" className="text-decoration-none small">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/privacy" className="text-decoration-none small">
                {t('footer.privacyPolicy')}
              </Link>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;