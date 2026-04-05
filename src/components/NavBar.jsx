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
      className="shadow-sm"
      data-bs-theme={theme}
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          {t('app.title')}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {/* 🎯 HOME BUTTON - ONLY ON OTHER PAGES */}
            {!isHomePage && (
              <Nav.Item className="me-3">
                <Button 
                  as={Link} 
                  to="/" 
                  variant={`outline-${theme === 'dark' ? 'light' : 'primary'}`}
                  size="sm"
                  className="d-flex align-items-center gap-1"
                >
                  <FaHome />
                  <span className="d-none d-md-inline">{t('navbar.backToHome')}</span>
                </Button>
              </Nav.Item>
            )}

            {/* Navigation Links - Responsive */}
            <Nav.Item className="me-3 d-lg-none">
              <Dropdown>
                <Dropdown.Toggle variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`} size="sm">
                  {t('navbar.menu', { defaultValue: 'Menu' })}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {navItems.map(item => (
                    <Dropdown.Item key={item.path} as={Link} to={item.path}>
                      {t(`navbar.${item.label}`, { defaultValue: item.label })}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>

            {/* Desktop Nav Links - ONLY About + Changelog */}
            <div className="d-none d-lg-flex gap-2">
              {navItems.map(item => (
                <Nav.Link 
                  key={item.path} 
                  as={Link} 
                  to={item.path}
                  className={`text-${theme === 'dark' ? 'light' : 'dark'}`}
                >
                  {t(`navbar.${item.label}`, { defaultValue: item.label })}
                </Nav.Link>
              ))}
            </div>

            {/* Language Dropdown */}
            <Dropdown className="me-3">
              <Dropdown.Toggle
                variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`}
                id="language-dropdown"
                size="sm"
              >
                <MdTranslate className="me-1" />
                {language.toUpperCase()}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => changeLanguage('en')} active={language === 'en'}>
                  English (EN)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('es')} active={language === 'es'}>
                  Español (ES)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Theme Toggle */}
            <Button
              variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`}
              size="sm"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;