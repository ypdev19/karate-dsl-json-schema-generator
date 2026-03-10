import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Alert, Form } from 'react-bootstrap';
import JsonEditor from './components/JsonEditor';
import { generateKarateSchema, generateKarateSnippet } from './utils/schemaConverter';
import './index.css';

function App() {

  const [inputJson, setInputJson] = useState(JSON.stringify({
    "id": 101,
    "name": "Alice",
    "active": true,
    "roles": ["admin", "user"],
    "user": {
      "email": "alice@example.com"
    }
  }, null, 2));

  const [requiredFields, setRequiredFields] = useState('');
  const [outputSchema, setOutputSchema] = useState('');
  const [error, setError] = useState(null);
  const [isInputError, setIsInputError] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);

  /**
   * Convert JSON → Karate Schema
   */
  const handleConvert = () => {
    setError(null);
    setOutputSchema('');
    setIsInputError(false);

    try {
      const parsed = JSON.parse(inputJson);

      const result = generateKarateSchema(
        parsed,
        requiredFields
      );

      setOutputSchema(result);

    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setIsInputError(true);
      console.error(err);
    }
  };

  /**
   * Copy schema
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputSchema);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  /**
   * Copy Karate snippet
   */
  const handleCopySnippet = async () => {
    try {
      const snippet = generateKarateSnippet(outputSchema);
      await navigator.clipboard.writeText(snippet);
    } catch {
      setError('Failed to copy snippet');
    }
  };

  /**
   * Demo loaders
   */
  const loadDemo = (type) => {
    let demoData;

    if (type === 'base') {
      demoData = {
        id: 101,
        name: "Alice",
        active: true,
        roles: ["admin", "user"],
        user: { email: "alice@example.com" }
      };
    } else {
      demoData = {
        id: 101,
        name: "Alice",
        active: true,
        user: {
          email: "alice@example.com",
          profile: {
            age: 30,
            verified: true
          }
        },
        orders: [{
          orderId: 1,
          amount: 99.99
        }]
      };
    }

    setInputJson(JSON.stringify(demoData, null, 2));
    setOutputSchema('');
    setError(null);
    setIsInputError(false);
  };

  return (
    <Container className="mt-4">

      <h1 className="text-center mb-4">
        JSON to Karate DSL Schema Converter
      </h1>

      {/* Demo Buttons */}
      <Row className="mb-3 text-center">
        <Col>
          <Button className="me-2" onClick={() => loadDemo('base')}>
            Load Base Demo
          </Button>
          <Button variant="success" onClick={() => loadDemo('advance')}>
            Load Advanced Demo
          </Button>
        </Col>
      </Row>

      {/* REQUIRED FIELDS INPUT (NEW) */}
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>
              Required Fields (comma separated)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Example: id, name, user.email"
              value={requiredFields}
              onChange={(e) => setRequiredFields(e.target.value)}
            />
            <Form.Text muted>
              Leave empty to treat all fields as required.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        {/* INPUT */}
        <Col md={6} className="mb-3">
          <Card className="h-100">
            <Card.Header>Input JSON</Card.Header>
            <Card.Body>
              <JsonEditor
                value={inputJson}
                onChange={setInputJson}
                height="400px"
                isError={isInputError}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* OUTPUT */}
        <Col md={6} className="mb-3">
          <Card className="h-100">
            <Card.Header>
              Generated Karate Schema
              <Button
                size="sm"
                className="float-end"
                onClick={handleCopy}
                disabled={!outputSchema}
              >
                Copy
              </Button>
            </Card.Header>

            <Card.Body>
              <JsonEditor
                value={outputSchema}
                readOnly
                height="400px"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ACTIONS */}
      <Row className="mt-3 text-center">
        <Col md={6} className="mx-auto">
          <Button size="lg" className="w-100 mb-2" onClick={handleConvert}>
            Convert to Schema
          </Button>

          <Button
            variant="success"
            size="lg"
            className="w-100"
            disabled={!outputSchema}
            onClick={() => setShowSnippet(!showSnippet)}
          >
            {showSnippet ? 'Hide Snippet' : 'Show Snippet'}
          </Button>
        </Col>
      </Row>

      {/* SNIPPET */}
      {showSnippet && outputSchema && (
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Header>
                Karate DSL Snippet
                <Button
                  size="sm"
                  className="float-end"
                  onClick={handleCopySnippet}
                >
                  Copy Snippet
                </Button>
              </Card.Header>

              <Card.Body>
                <pre className="bg-light p-3 rounded">
                  {generateKarateSnippet(outputSchema)}
                </pre>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

    </Container>
  );
}

export default App;