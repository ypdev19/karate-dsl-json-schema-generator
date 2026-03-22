/**
 * App.jsx: Full layout orchestrator (flex-column min-vh-100)
 */
import React, { useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { useGlobalContext } from './hooks/useGlobalContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import JsonEditor from './components/JsonEditor';
import { generateKarateSchema, generateKarateSnippet } from './utils/schemaConverter';
import { loadDemo, triggerToast, copyToClipboard, DEMO_DATA } from './utils/appUtils';
import './index.css';

function App() {
  const { theme } = useGlobalContext();

  // State
  const [inputJson, setInputJson] = useState(JSON.stringify(DEMO_DATA.base, null, 2));
  const [requiredFields, setRequiredFields] = useState('');
  const [outputSchema, setOutputSchema] = useState('');
  const [error, setError] = useState(null);
  const [isInputError, setIsInputError] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Memoized toast trigger
  const toastTrigger = useCallback(() => triggerToast(setShowToast), []);

  /**
   * Convert JSON → Karate Schema
   */
  const handleConvert = () => {
    setError(null);
    setOutputSchema('');
    setIsInputError(false);

    try {
      const parsed = JSON.parse(inputJson);
      const result = generateKarateSchema(parsed, requiredFields);
      setOutputSchema(result);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setIsInputError(true);
      console.error(err);
    }
  };

  /**
   * Copy handlers (using shared utility)
   */
  const handleCopy = () => copyToClipboard(outputSchema, setError, toastTrigger);
  const handleCopySnippet = () => {
    const snippet = generateKarateSnippet(outputSchema);
    copyToClipboard(snippet, setError, toastTrigger);
  };

  /**
   * Demo loader (using shared utility)
   */
  const handleLoadDemo = (type) => {
    loadDemo(type, setInputJson, setOutputSchema, setError, setIsInputError);
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${theme}`}>
      <NavBar />
      
      <main className={`flex-grow-1 ${theme}`}>
        <Container fluid className="py-4">
          <h1 className="text-center mb-4">
            JSON to Karate DSL Schema Converter
          </h1>

          {/* Demo Buttons */}
          <div className="row mb-3 text-center">
            <div className="col">
              <button 
                className="btn btn-outline-primary me-2" 
                onClick={() => handleLoadDemo('base')}
              >
                Load Base Demo
              </button>
              <button 
                className="btn btn-success" 
                onClick={() => handleLoadDemo('advance')}
              >
                Load Advanced Demo
              </button>
            </div>
          </div>

          {/* REQUIRED FIELDS INPUT */}
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Required Fields (comma separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: id, name, user.email"
                  value={requiredFields}
                  onChange={(e) => setRequiredFields(e.target.value)}
                />
                <div className="form-text">
                  Leave empty to treat all fields as required.
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="row">
            {/* INPUT */}
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header">
                  Input JSON
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

            {/* OUTPUT */}
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  Generated Karate Schema
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopy}
                    disabled={!outputSchema}
                  >
                    Copy
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

          {/* ACTIONS */}
          <div className="row mt-4 text-center">
            <div className="col-md-6 mx-auto">
              <button 
                className="btn btn-primary btn-lg w-100 mb-3" 
                onClick={handleConvert}
              >
                Convert to Schema
              </button>

              <button
                className="btn btn-success btn-lg w-100"
                disabled={!outputSchema}
                onClick={() => setShowSnippet(!showSnippet)}
              >
                {showSnippet ? 'Hide Snippet' : 'Show Snippet'}
              </button>
            </div>
          </div>

          {/* SNIPPET */}
          {showSnippet && outputSchema && (
            <div className="row mt-4">
              <div className="col">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    Karate DSL Snippet
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleCopySnippet}
                    >
                      Copy Snippet
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <pre className="p-3 m-0 bg-light small">
                      {generateKarateSnippet(outputSchema)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* TOAST */}
      {showToast && (
        <div className="copy-toast">
          Copy to Clipboard!
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;