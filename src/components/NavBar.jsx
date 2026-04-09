import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaSun, FaMoon, FaHome } from 'react-icons/fa';
import { MdTranslate } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../contexts/GlobalContext';

const NavBar = () => {
  const { theme, t, toggleTheme, language, changeLanguage } = useGlobalContext();
  const location = useLocation();

  const navItems = [
    { path: '/about', label: 'about' },
    { path: '/changelog', label: 'changelog' }
  ];

  const isHomePage = location.pathname === '/';

  return (
    <Navbar 
      bg={theme} 
      variant={theme} 
      expand="lg" 
      className="shadow-sm py-2 py-lg-1"
      data-bs-theme={theme}
      sticky="top"
    >
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-5 fs-lg-4">
          {t('app.title')}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" className="ms-2 me-2" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end pe-lg-2">
          
          {/* Home Button - Compact */}
          {!isHomePage && (
            <Nav.Item className="pe-2">
              <Button 
                as={Link} 
                to="/" 
                variant={`outline-${theme === 'dark' ? 'light' : 'primary'}`}
                size="sm"
                className="btn-sm px-2 py-1 me-0"
              >
                <FaHome className="fs-6 me-1" />
                <span className="d-none d-md-inline">{t('navbar.backToHome')}</span>
              </Button>
            </Nav.Item>
          )}

          {/* 🎯 RIGHT-ALIGNED: Compact spacing */}
          <Nav className="align-items-center gap-1 gap-md-2">
            
            {/* Desktop Links */}
            <div className="d-none d-lg-flex gap-1 gap-lg-2">
              {navItems.map(item => (
                <Nav.Link 
                  key={item.path} 
                  as={Link} 
                  to={item.path}
                  className="px-2 py-1 rounded text-decoration-none fw-medium"
                >
                  {t(`navbar.${item.label}`)}
                </Nav.Link>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="d-lg-none">
              <Dropdown>
                <Dropdown.Toggle 
                  variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`} 
                  size="sm" 
                  className="px-2 py-1"
                >
                  {t('navbar.menu')}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {navItems.map(item => (
                    <Dropdown.Item key={item.path} as={Link} to={item.path}>
                      {t(`navbar.${item.label}`)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Language - Compact */}
            <Dropdown>
              <Dropdown.Toggle
                variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`}
                size="sm"
                className="px-2 py-1"
              >
                <MdTranslate className="me-1 fs-6" />
                <span className="d-none d-sm-inline">{language.toUpperCase()}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => changeLanguage('en')} active={language === 'en'}>
                  EN
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('es')} active={language === 'es'}>
                  ES
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Theme - Compact */}
            <Button
              variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`}
              size="sm"
              onClick={toggleTheme}
              className="px-2 py-1"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <FaSun className="fs-6" /> : <FaMoon className="fs-6" />}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;