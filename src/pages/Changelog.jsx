import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { useGlobalContext } from '../contexts/GlobalContext';

const Changelog = () => {
  const { t, theme } = useGlobalContext();

  const changelogGroups = [
    {
      date: 'March 2024',
      changes: [
        '✅ Added full routing (About, Privacy, Terms, Changelog)',
        '✅ Home button on nav (hidden on home page)',
        '✅ Markdown rendering for Privacy/Terms with language support',
        '✅ 100% responsive navbar (mobile hamburger → desktop)',
        '✅ Release v2.0.0'
      ]
    },
    {
      date: 'February 2024',
      changes: [
        '✅ Ace Editor integration (JSON syntax highlighting)',
        '✅ File upload (JSON only)',
        '✅ Demo data (Base + Advanced)',
        '✅ Full responsive design (mobile→4K)',
        '✅ Snippet auto-scroll (smart, no bounceback)',
        '✅ Release v1.2.0'
      ]
    },
    {
      date: 'January 2024',
      changes: [
        '✅ Core JSON → Karate schema conversion',
        '✅ Required fields support',
        '✅ Dark theme (persistent)',
        '✅ i18n ready (EN/ES)',
        '✅ Release v1.0.0'
      ]
    }
  ];

  return (
    <div className="changelog-content">
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10}>
          <h1 className={`text-center fw-bold mb-4 ${theme}`}>
            Changelog
          </h1>
          <p className={`text-center lead mb-5 ${theme === 'dark' ? 'text-light-secondary' : 'text-muted'}`}>
            All updates and improvements
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {changelogGroups.map((group, index) => (
            <div 
              key={group.date} 
              className={`changelog-group mb-5 pb-4 border-bottom ${
                theme === 'dark' 
                  ? 'border-light border-opacity-25' 
                  : 'border-secondary border-opacity-25'
              }`}
            >
              {/* Month/Year Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className={`fw-bold mb-0 ${theme}`}>
                  {group.date}
                </h2>
                <Badge 
                  bg={theme} 
                  className="px-3 py-2 fw-semibold text-white"
                  text="dark"
                >
                  {group.changes.length} changes
                </Badge>
              </div>

              {/* Clean Bullet List - FIXED COLORS */}
              <ul className="list-unstyled changelog-bullets ps-0">
                {group.changes.map((change, i) => (
                  <li 
                    key={i} 
                    className={`mb-3 ps-4 pe-4 py-2 changelog-item rounded-3 ${
                      theme === 'dark'
                        ? 'bg-black bg-opacity-20 text-light'  // ✅ Dark: subtle black overlay
                        : 'bg-white shadow-sm text-dark'       // ✅ Light: white with shadow
                    }`}
                    style={{ borderLeft: '3px solid var(--bs-primary)' }}
                  >
                    <span 
                      className={`changelog-bullet fw-bold me-3 fs-5 ${
                        theme === 'dark' ? 'text-primary' : 'text-primary'
                      }`}
                      style={{ minWidth: '24px' }}
                    >
                      -
                    </span>
                    <span className="changelog-text">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default Changelog;