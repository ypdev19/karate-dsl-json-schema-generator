// src/App.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Alert, Form } from 'react-bootstrap';
import JsonEditor from './components/JsonEditor';
import { ejs } from './utils/schemaConverter';
import './index.css';

function App() {
  const [inputJson, setInputJson] = useState(JSON.stringify({
    "*id": "uk123",
    "*name": "tom",
    "*email": "tom@gmail.com",
    "arr": [{
      "site": "string",
      "url": "string"
    }]
  }, null, 2));

  const [outputSchema, setOutputSchema] = useState('');
  const [error, setError] = useState(null);

  const handleConvert = () => {
    setError(null);
    setOutputSchema('');
    try {
      const parsed = JSON.parse(inputJson);
      const result = ejs(parsed);
      setOutputSchema(JSON.stringify(result, null, 2));
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      console.error(err);
    }
  };

  const loadDemo = (type) => {
    let demoData;
    if (type === 'base') {
      demoData = {
        "*id": "uk123",
        "*name": "tom",
        "*email": "tom@gmail.com",
        "arr": [{ "site": "string", "url": "string" }]
      };
    } else {
      demoData = {
        "*id": "string",
        "*name": {
          "type": "string",
          "enum": ["tom", "jay"],
          "minLength": 1,
          "maxLength": 10
        },
        "*images": [
          {
            "*id": "number",
            "names": {
              "type": "array",
              "title": "Images Collections.",
              "items": {
                "*id": "string",
                "*name": "string"
              }
            }
          }
        ]
      };
    }
    setInputJson(JSON.stringify(demoData, null, 2));
    setOutputSchema('');
    setError(null);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">JSON to Schema Converter</h1>
      
      <Row className="mb-3">
        <Col md={12} className="text-center">
          <Button variant="outline-primary" onClick={() => loadDemo('base')} className="me-2">
            Load Base Demo
          </Button>
          <Button variant="outline-success" onClick={() => loadDemo('advance')}>
            Load Advanced Demo
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={6} className="mb-3">
          <Card className="h-100">
            <Card.Header>Input JSON</Card.Header>
            <Card.Body className="d-flex flex-column">
              <JsonEditor 
                value={inputJson} 
                onChange={setInputJson} 
                height="400px"
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="h-100">
            <Card.Header>Generated Schema</Card.Header>
            <Card.Body className="d-flex flex-column">
              <JsonEditor 
                value={outputSchema} 
                readOnly={true} 
                height="400px"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Button variant="primary" size="lg" onClick={handleConvert} className="w-100">
            Convert to Schema
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default App;