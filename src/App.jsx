/**
 * App.jsx: Full layout orchestrator with i18n support
 * Flex-column min-vh-100 layout, theme-aware, responsive
 */
import React, { useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
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
  triggerToast,
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
  const [showToast, setShowToast] = useState(false);

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
   * Copy Schema to Clipboard
   */
  const handleCopy = useCallback(() => {
    if (!outputSchema) return;
    
    copyToClipboard(
      outputSchema,
      setError,
      () => triggerToast(setShowToast, t('app.copySuccess')),
      t('app.copySuccess')
    );
  }, [outputSchema, t]);

  /**
   * Copy Karate Snippet to Clipboard
   */
  const handleCopySnippet = useCallback(() => {
    if (!outputSchema) return;
    
    const snippet = generateKarateSnippet(outputSchema);
    copyToClipboard(
      snippet,
      setError,
      () => triggerToast(setShowToast, t('app.copySuccess')),
      t('app.copySuccess')
    );
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
          {/* Title */}
          <h1 className="text-center mb-4">{t('app.title')}</h1>

          {/* Demo Buttons */}
          <div className="row mb-3 text-center">
            <div className="col">
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
            </div>
          </div>

          {/* REQUIRED FIELDS INPUT */}
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('app.requiredFields')}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('app.requiredFields')}
                  value={requiredFields}
                  onChange={(e) => setRequiredFields(e.target.value)}
                />
                <div className="form-text">
                  {t('app.requiredFieldsHelp')}
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              />
            </div>
          )}

          {/* Editors Layout */}
          <div className="row">
            {/* INPUT EDITOR */}
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header">
                  {t('app.inputJson')}
                </div>
                <div className="card-body p-0">
                  <JsonEditor
                    value={inputJson}
                    onChange={setInputJson}
                    height="400px"
                    isError={isInputError}
                  />
                </div>
              </div>
            </div>

            {/* OUTPUT EDITOR */}
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  {t('app.generatedSchema')}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopy}
                    disabled={!outputSchema}
                  >
                    {t('app.copy')}
                  </button>
                </div>
                <div className="card-body p-0">
                  <JsonEditor
                    value={outputSchema}
                    readOnly
                    height="400px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mt-4 text-center">
            <div className="col-md-6 mx-auto">
              <button 
                className="btn btn-primary btn-lg w-100 mb-3" 
                onClick={handleConvert}
              >
                {t('app.convertToSchema')}
              </button>

              <button
                className="btn btn-success btn-lg w-100"
                disabled={!outputSchema}
                onClick={() => setShowSnippet(!showSnippet)}
              >
                {showSnippet ? t('app.hideSnippet') : t('app.showSnippet')}
              </button>
            </div>
          </div>

          {/* KARATE SNIPPET */}
          {showSnippet && outputSchema && (
            <div className="row mt-4">
              <div className="col">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    {t('app.karateSnippet')}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleCopySnippet}
                    >
                      {t('app.copySnippet')}
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <pre className="p-3 m-0 bg-light small overflow-auto">
                      {generateKarateSnippet(outputSchema)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="copy-toast position-fixed bottom-0 end-0 m-3">
          {t('app.copySuccess')}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;