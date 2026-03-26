/**
 * App.jsx: Full layout orchestrator with i18n support
 * NEW: Dual centered buttons (Convert + Snippet toggle) between editors
 * Snippet toggle only shows when schema exists (conditional UX)
 * Flex-column min-vh-100 layout, theme-aware, responsive, mobile-first
 */
import React, { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useGlobalContext } from './contexts/GlobalContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import JsonEditor from './components/JsonEditor';

import { 
  generateKarateSchema, 
  generateKarateSnippet 
} from './utils/schemaConverter';

import { 
  loadDemo, 
  copyToClipboard, 
  DEMO_DATA 
} from './utils/appUtils';

import './index.css';

function App() {
  const { theme, t } = useGlobalContext();

  // State
  const [inputJson, setInputJson] = useState(JSON.stringify(DEMO_DATA.base, null, 2));
  const [requiredFields, setRequiredFields] = useState('');
  const [outputSchema, setOutputSchema] = useState('');
  const [error, setError] = useState(null);
  const [isInputError, setIsInputError] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
  
  // Copy button states
  const [copyStatus, setCopyStatus] = useState('copy');
  const [snippetStatus, setSnippetStatus] = useState('copy');

  /**
   * Convert JSON → Karate Schema
   */
  const handleConvert = useCallback(() => {
    setError(null);
    setOutputSchema('');
    setIsInputError(false);

    try {
      const parsed = JSON.parse(inputJson);
      const result = generateKarateSchema(parsed, requiredFields);
      setOutputSchema(result);
    } catch (err) {
      setError(t('app.invalidJson'));
      setIsInputError(true);
      console.error('JSON Parse Error:', err);
    }
  }, [inputJson, requiredFields, t]);

  /**
   * Copy Schema to Clipboard + Button Feedback
   */
  const handleCopy = useCallback(() => {
    if (!outputSchema) return;
    copyToClipboard(
      outputSchema,
      setError,
      null, // ← ADD THIS: no toast
      t('app.copySuccess')
    );
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('copy'), 1200);
  }, [outputSchema, t]);

  /**
   * Copy Karate Snippet to Clipboard + Button Feedback
   */
  const handleCopySnippet = useCallback(() => {
    if (!outputSchema) return;
    const snippet = generateKarateSnippet(outputSchema);
    copyToClipboard(
      snippet,
      setError,
      null, // ← ADD THIS: no toast  
      t('app.copySuccess')
    );
    setSnippetStatus('copied');
    setTimeout(() => setSnippetStatus('copy'), 1200);
  }, [outputSchema, t]);

  /**
   * Load Demo Data
   */
  const handleLoadDemo = useCallback((type) => {    
    try {
      const demoData = type === 'advanced' ? DEMO_DATA.advanced : DEMO_DATA.base;      
      const jsonString = JSON.stringify(demoData, null, 2);
      
      setInputJson(jsonString);
      setOutputSchema('');
      setError(null);
      setIsInputError(false);
    } catch (err) {
      console.error('Demo error:', err);
    }
  }, []);

  return (
    <div className={`d-flex flex-column min-vh-100 ${theme}`}>
      <NavBar />
      
      <main className={`flex-grow-1 ${theme}`}>
        {/* NEW: Max-width centered container for ALL screens */}
        <Container className="main-content-container py-4">

          {/* REQUIRED FIELDS INPUT */}
          <Row className="mb-4">
            <Col>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('app.requiredFields')}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('app.inputPlaceholder')}
                  value={requiredFields}
                  onChange={(e) => setRequiredFields(e.target.value)}
                />
              </div>
            </Col>
          </Row>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              />
            </div>
          )}

          {/* RESPONSIVE EDITORS LAYOUT */}
          <Row className="g-4 mb-4">
            {/* INPUT EDITOR */}
            <Col xs={12} lg={5}>
              <div className="editor-card h-100">
                <div className="card-header d-flex justify-content-between align-items-center pb-2">
                  <span className="fw-semibold">{t('app.inputJson')}</span>
                  
                  {/* DEMO BUTTONS TOOLBAR */}
                  <div className="btn-group btn-group-sm gap-1" role="group">
                    <button 
                      className="btn btn-outline-secondary demo-btn"
                      title={t('app.loadBaseDemo')}
                      onClick={() => {
                        console.log('BASE clicked!'); // DEBUG
                        handleLoadDemo('base');
                      }}
                    >
                      {t('app.demoBaseShort')}
                    </button>
                    <button 
                      className="btn btn-outline-success demo-btn"
                      title={t('app.loadAdvancedDemo')}
                      onClick={() => handleLoadDemo('advanced')}
                    >
                      {t('app.demoAdvancedShort')}
                    </button>
                  </div>
                </div>
                
                <div className="card-body p-0 flex-grow-1">
                  <JsonEditor
                    value={inputJson}
                    themeMode={theme}
                    onChange={setInputJson}
                    height="450px"
                    isError={isInputError}
                  />
                </div>
              </div>
            </Col>

            {/* ACTION BUTTONS - Always centered */}
            <Col xs={12} lg={2} className="d-flex align-items-center justify-content-center">
              <div className="action-buttons-vertical">
                {/* Convert Button - Always visible, prominent */}
                <button 
                  className="btn btn-primary btn-lg w-100 mb-2 convert-main-btn"
                  onClick={handleConvert}
                >
                  {t('app.convertToSchema')}
                </button>
                
                {/* Snippet Toggle - Only when schema exists */}
                {outputSchema && (
                  <button
                    className="btn btn-success btn-lg w-100"
                    onClick={() => setShowSnippet(!showSnippet)}
                  >
                    {showSnippet ? t('app.hideSnippet') : t('app.showSnippet')}
                  </button>
                )}
              </div>
            </Col>

            {/* OUTPUT EDITOR */}
            <Col xs={12} lg={5}>
              <div className="editor-card h-100">
                <div className="card-header d-flex justify-content-between align-items-center pb-2">
                  <span>{t('app.generatedSchema')}</span>
                  <button
                    className={`btn btn-sm ${
                      copyStatus === 'copied' 
                        ? 'btn-success' 
                        : 'btn-outline-secondary'
                    }`}
                    onClick={handleCopy}
                    disabled={!outputSchema}
                  >
                    {copyStatus === 'copied' ? t('app.copied') : t('app.copy')}
                  </button>
                </div>
                <div className="card-body p-0 flex-grow-1">
                  <JsonEditor
                    value={outputSchema}
                    themeMode={theme}
                    readOnly
                    height="100%"
                    minHeight="450px"
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* KARATE SNIPPET */}
          {showSnippet && outputSchema && (
            <Row>
              <Col xs={12}>
                <div className="snippet-card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    {t('app.karateSnippet')}
                    <button
                      className={`btn btn-sm ${
                        snippetStatus === 'copied' 
                          ? 'btn-success' 
                          : 'btn-outline-secondary'
                      }`}
                      onClick={handleCopySnippet}
                      disabled={!outputSchema}
                    >
                      {snippetStatus === 'copied' ? t('app.copied') : t('app.copySnippet')}
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <pre className="p-3 m-0 snippet-pre bg-light small">
                      {generateKarateSnippet(outputSchema)}
                    </pre>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default App;