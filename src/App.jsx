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
      t('app.copySuccess')
    );
    
    setSnippetStatus('copied');
    setTimeout(() => setSnippetStatus('copy'), 1200);
  }, [outputSchema, t]);

  /**
   * Load Demo Data
   */
  const handleLoadDemo = useCallback((type) => {
    loadDemo(type, setInputJson, setOutputSchema, setError, setIsInputError);
  }, []);

  return (
    <div className={`d-flex flex-column min-vh-100 ${theme}`}>
      <NavBar />
      
      <main className={`flex-grow-1 ${theme}`}>
        <Container fluid className="py-4">
          {/* Demo Buttons */}
          <Row className="mb-3 text-center">
            <Col>
              <button 
                className="btn btn-outline-primary me-2" 
                onClick={() => handleLoadDemo('base')}
              >
                {t('app.loadBaseDemo')}
              </button>
              <button 
                className="btn btn-success" 
                onClick={() => handleLoadDemo('advance')}
              >
                {t('app.loadAdvancedDemo')}
              </button>
            </Col>
          </Row>

          {/* REQUIRED FIELDS INPUT */}
          <Row className="mb-4">
            <Col md={12}>
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

          {/* Editors + Centered Action Buttons Layout */}
          <div className="editors-container">
            {/* INPUT EDITOR */}
            <div className="editor-column input-editor">
              <div className="card h-100">
                <div className="card-header">
                  {t('app.inputJson')}
                </div>
                <div className="card-body p-0">
                  <JsonEditor
                    value={inputJson}
                    themeMode={theme}
                    onChange={setInputJson}
                    height="450px"
                    isError={isInputError}
                  />
                </div>
              </div>
            </div>

            {/* CENTRAL ACTION BUTTONS - Dual layout */}
            <div className="convert-button-container">
              <div className="d-flex flex-column gap-2 justify-content-center align-items-stretch">
                {/* Convert Button - Always visible */}
                <button 
                  className="btn btn-primary btn-lg"
                  style={{ fontSize: '16px' }}
                  onClick={handleConvert}
                >
                  {t('app.convertToSchema')}
                </button>
                
                {/* Snippet Toggle - Only when schema exists */}
                {outputSchema && (
                  <button
                    className="btn btn-success btn-lg"
                    style={{ fontSize: '16px' }}
                    onClick={() => setShowSnippet(!showSnippet)}
                  >
                    {showSnippet ? t('app.hideSnippet') : t('app.showSnippet')}
                  </button>
                )}
              </div>
            </div>

            {/* OUTPUT EDITOR */}
            <div className="editor-column output-editor">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  {t('app.generatedSchema')}
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
                <div className="card-body p-0">
                  <JsonEditor
                    value={outputSchema}
                    themeMode={theme}
                    readOnly
                    height="450px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KARATE SNIPPET - REMOVED from bottom (now controlled by center button) */}
          {showSnippet && outputSchema && (
            <Row className="mt-4">
              <Col>
                <div className="card">
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
                    <pre className="p-3 m-0 bg-light small overflow-auto">
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