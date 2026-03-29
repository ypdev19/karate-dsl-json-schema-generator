/**
 * App.jsx: Full layout with Upload + Clear All + Empty start
 * FEATURES: 
 * - Empty JSON on load (cursor line 1)
 * - Upload 📁 (JSON only, required untouched)
 * - Clear All 🗑️ (disabled when empty, clears JSON+required+output)
 * - Generate NEVER clears required field
 * - Perfect toolbar: [📁][🗑️][Base][Adv]
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  copyToClipboard, 
  DEMO_DATA 
} from './utils/appUtils';

import './index.css';

function App() {
  const { theme, t } = useGlobalContext();

  // State - EMPTY JSON on load
  const [inputJson, setInputJson] = useState(''); // ← EMPTY START
  const [requiredFields, setRequiredFields] = useState('');
  const [outputSchema, setOutputSchema] = useState('');
  const [error, setError] = useState(null);
  const [isInputError, setIsInputError] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
  const [isClearable, setIsClearable] = useState(false); // ← DISABLED initially
  
  // Refs
  const fileInputRef = useRef(null);
  
  // Copy states
  const [copyStatus, setCopyStatus] = useState('copy');
  const [snippetStatus, setSnippetStatus] = useState('copy');

  // Clear All enable/disable logic
  useEffect(() => {
    setIsClearable(inputJson.trim() !== '{}' && inputJson.trim() !== '');
  }, [inputJson]);

  /**
   * Upload JSON File → JSON only (required untouched)
   */
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          setInputJson(event.target.result);
          setOutputSchema('');
          setError(null);
          setIsInputError(false);
          setShowSnippet(false);
        } catch (err) {
          setError(t('app.invalidJson'));
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, [t]);

  /**
   * Clear All → JSON + Required + Output
   */
  const handleClearAll = useCallback(() => {
    if (!isClearable) return;
    setInputJson('');
    setRequiredFields('');
    setOutputSchema('');
    setError(null);
    setIsInputError(false);
    setShowSnippet(false);
  }, [isClearable]);

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

  /**
   * Convert JSON → Karate Schema (NEVER clears required)
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
   * Copy Schema to Clipboard
   */
  const handleCopy = useCallback(() => {
    if (!outputSchema) return;
    copyToClipboard(
      outputSchema,
      setError,
      null,
      t('app.copySuccess')
    );
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('copy'), 1200);
  }, [outputSchema, t]);

  /**
   * Copy Karate Snippet
   */
  const handleCopySnippet = useCallback(() => {
    if (!outputSchema) return;
    const snippet = generateKarateSnippet(outputSchema);
    copyToClipboard(
      snippet,
      setError,
      null,
      t('app.copySuccess')
    );
    setSnippetStatus('copied');
    setTimeout(() => setSnippetStatus('copy'), 1200);
  }, [outputSchema, t]);

  return (
    <div className={`d-flex flex-column min-vh-100 ${theme}`}>
      <NavBar />
      
      <main className={`flex-grow-1 ${theme}`}>
        <Container className="main-content-container py-4">

          {/* REQUIRED FIELDS */}
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

          {/* EDITORS LAYOUT */}
          <Row className="g-4 mb-4">
            {/* INPUT EDITOR */}
            <Col xs={12} lg={5}>
              <div className="editor-card h-100">
                <div className="card-header d-flex justify-content-between align-items-center pb-2">
                  <span className="fw-semibold">{t('app.inputJson')}</span>
                  
                  {/* PERFECT TOOLBAR: Upload + Clear + Demos */}
                  <div className="btn-group btn-group-sm gap-2" role="group">
                    {/* UPLOAD */}
                    <input 
                      type="file" 
                      accept=".json" 
                      className="d-none" 
                      id="json-upload"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                    <label 
                      htmlFor="json-upload" 
                      className="btn btn-outline-primary demo-btn icon-only"
                      title={t('app.uploadJson')}
                    >
                      📁
                    </label>
                    
                    {/* CLEAR ALL */}
                    <button 
                      className={`btn demo-btn icon-only ${isClearable ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                      onClick={handleClearAll}
                      disabled={!isClearable}
                      title={t('app.clearAll')}
                    >
                      🗑️
                    </button>
                    
                    {/* DEMOS */}
                    <button 
                      className="btn btn-outline-secondary demo-btn text-btn"
                      title={t('app.loadBaseDemo')}
                      onClick={() => handleLoadDemo('base')}
                    >
                      {t('app.demoBaseShort')}
                    </button>
                    <button 
                      className="btn btn-outline-success demo-btn text-btn"
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

            {/* ACTION BUTTONS */}
            <Col xs={12} lg={2} className="d-flex align-items-center justify-content-center">
              <div className="action-buttons-vertical">
                <button 
                  className="btn btn-primary btn-lg w-100 mb-2 convert-main-btn"
                  onClick={handleConvert}
                >
                  {t('app.convertToSchema')}
                </button>
                
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