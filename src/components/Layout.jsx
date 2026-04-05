/**
 * Layout.jsx: Shared wrapper for ALL pages
 * Ensures consistent spacing/padding across Home + static pages
 */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useGlobalContext } from '../contexts/GlobalContext';

const Layout = ({ children }) => {
  const { theme } = useGlobalContext();
  
  return (
    <div className={`page-content ${theme}`}>
      <Container className="py-4">
        <Row>
          <Col xs={12}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;