/**
 * Home.jsx: 100% ORIGINAL CONVERTER - Just wrapped for routing
 * All state, handlers, editors EXACTLY as App.jsx was
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useGlobalContext } from '../contexts/GlobalContext';
import JsonEditor from '../components/JsonEditor';
import { 
  generateKarateSchema, 
  generateKarateSnippet 
} from '../utils/schemaConverter';
import { 
  copyToClipboard, 
  downloadSchema,
  DEMO_DATA 
} from '../utils/appUtils';

const Home = () => {
  const { theme, t } = useGlobalContext();

  // 👇 ALL ORIGINAL STATE/REFS - UNCHANGED
  const [inputJson, setInputJson] = useState('');
  const [requiredFields, setRequiredFields] = useState('');
  const [outputSchema, setOutputSchema] = useState('');
  const [error, setError] = useState(null);
  const [isInputError, setIsInputError] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
  const [isClearable, setIsClearable] = useState(false);
  
  const fileInputRef = useRef(null);
  const snippetRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('copy');
  const [snippetStatus, setSnippetStatus] = useState('copy');
  const [downloadStatus, setDownloadStatus] = useState('download');

  // 👇 ALL ORIGINAL LOGIC - 100% UNCHANGED
  useEffect(() => {
    setIsClearable(inputJson.trim() !== '{}' && inputJson.trim() !== '');
  }, [inputJson]);

  useEffect(() => {
    if (showSnippet && snippetRef.current) {
      requestAnimationFrame(() => {
        const element = snippetRef.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.top < -20 || rect.bottom > (window.innerHeight + 20)) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const navbarHeight = 80;
          const targetY = scrollTop + rect.top - navbarHeight;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [showSnippet]);

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

  const handleClearAll = useCallback(() => {
    if (!isClearable) return;
    setInputJson('');
    setRequiredFields('');
    setOutputSchema('');
    setError(null);
    setIsInputError(false);
    setShowSnippet(false);
  }, [isClearable]);

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

  const handleCopy = useCallback(() => {
    if (!outputSchema) return;
    copyToClipboard(outputSchema, setError, null, t('app.copySuccess'));
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('copy'), 1200);
  }, [outputSchema, t]);

  const handleCopySnippet = useCallback(() => {
    if (!outputSchema) return;
    const snippet = generateKarateSnippet(outputSchema);
    copyToClipboard(snippet, setError, null, t('app.copySuccess'));
    setSnippetStatus('copied');
    setTimeout(() => setSnippetStatus('copy'), 1200);
  }, [outputSchema, t]);

  const handleDownload = useCallback(() => {
    if (!outputSchema) return;
    downloadSchema(outputSchema);
    setDownloadStatus('downloaded');
    setTimeout(() => setDownloadStatus('download'), 1200);
  }, [outputSchema]);

  // 👇 ALL ORIGINAL JSX - EXACT SAME STRUCTURE
  return (
    <>
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

      {/* EDITORS LAYOUT - IDENTICAL */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={5}>
          <div className="editor-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center pb-2">
              <span className="fw-semibold">{t('app.inputJson')}</span>
              <div className="btn-group btn-group-sm gap-2" role="group">
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
                <button 
                  className={`btn demo-btn icon-only ${isClearable ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                  onClick={handleClearAll}
                  disabled={!isClearable}
                  title={t('app.clearAll')}
                >
                  🗑️
                </button>
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
                className={`btn btn-success btn-lg w-100 ${showSnippet ? 'snippet-visible' : ''}`}
                onClick={() => setShowSnippet(!showSnippet)}
              >
                {showSnippet ? t('app.hideSnippet') : t('app.showSnippet')}
              </button>
            )}
          </div>
        </Col>

        <Col xs={12} lg={5}>
          <div className="editor-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center pb-2">
            <span>{t('app.generatedSchema')}</span>
              
              <div className="btn-group btn-group-sm gap-2" role="group">
                <button
                  className={`btn btn-sm demo-btn icon-only ${
                    copyStatus === 'copied' 
                      ? 'btn-success' 
                      : 'btn-outline-secondary'
                  }`}
                  onClick={handleCopy}
                  disabled={!outputSchema}
                  title={t('app.copy')}
                >
                  {copyStatus === 'copied' ? '✓' : '📋'}
                </button>
                <button
                  className={`btn btn-sm demo-btn icon-only ${
                    downloadStatus === 'downloaded' 
                      ? 'btn-success' 
                      : 'btn-outline-success'
                  }`}
                  onClick={handleDownload}
                  disabled={!outputSchema}
                  title={t('app.downloadSchema')}
                >
                  {downloadStatus === 'downloaded' ? '✓' : '📥'}
                </button>
              </div>
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

      {/* KARATE SNIPPET - THEME-AWARE + AUTO-SCROLL */}
      {showSnippet && outputSchema && (
        <Row className="mt-4">
          <Col xs={12}>
            <div ref={snippetRef} className="snippet-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                {t('app.karateSnippet')}
                <button
                  className={`btn btn-sm demo-btn ${
                    snippetStatus === 'copied' 
                      ? 'btn-success' 
                      : 'btn-outline-secondary'
                  }`}
                  onClick={handleCopySnippet}
                  disabled={!outputSchema}
                  title={t('app.copySnippet')}
                >
                  {snippetStatus === 'copied' ? '✓' : '📋'}
                </button>
              </div>
              <div className="card-body p-0">
                <pre className="p-3 m-0 snippet-pre theme-aware-pre small">
                  {generateKarateSnippet(outputSchema)}
                </pre>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Home;