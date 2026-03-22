import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import { MdTranslate } from 'react-icons/md';
import { useGlobalContext } from '../contexts/GlobalContext';

const NavBar = () => {
  const { theme, t, toggleTheme, language, changeLanguage } = useGlobalContext();

  return (
    <Navbar 
      bg={theme} 
      variant={theme} 
      expand="lg" 
      className="shadow-sm"
      data-bs-theme={theme}
    >
      <Container fluid>
        <Navbar.Brand href="#home">
          {t('app.title')}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
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
              className="me-2"
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