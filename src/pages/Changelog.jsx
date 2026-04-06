import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { useGlobalContext } from '../contexts/GlobalContext';
import changelogData from '../locales/changelog.json';

const Changelog = () => {
  const { t, theme } = useGlobalContext();

  const changelogGroups = changelogData;

  return (
    <div className={`changelog-content ${theme}`}>
      {/* Theme-aware data attribute for Bootstrap components */}
      <div data-bs-theme={theme}>
        <Row className="justify-content-center mb-5">
          <Col xs={12} md={10}>
            <h1 className="text-center fw-bold mb-4 changelog-title">
              Changelog
            </h1>
            <p className="text-center lead mb-5 changelog-subtitle">
              All updates and improvements
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            {changelogGroups.map((group, index) => (
              <div 
                key={group.date} 
                className="changelog-group mb-5 pb-4"
              >
                {/* Month/Year Header - Fixed Badge */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h2 className="fw-bold mb-0 changelog-date">
                    {group.date}
                  </h2>
                  <Badge 
                    bg="primary" 
                    className="changelog-badge px-3 py-2 fw-semibold"
                  >
                    {group.changes.length} changes
                  </Badge>
                </div>

                {/* Clean Bullet List - Theme-aware */}
                <ul className="list-unstyled ps-0 mb-0">
                  {group.changes.map((change, i) => (
                    <li 
                      key={i} 
                      className={`mb-2 changelog-item ${theme}`}
                    >
                      <span className="changelog-text">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Changelog;