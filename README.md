# karate-dsl-json-schema-generator

A generator for convert a JSON into a valid Karate DSL JSON Schema

## easy-json-schema

A succinct json-schema language, simplify the json-schema definition.

## install

npm install easy-json-schema

## Usage

```javascript
const ejs = require('easy-json-schema');
const jsonSchema = ejs(json);
console.log(jsonSchema);
```

## example

### Base

Input:

```json
{
  "id": "string",
  "*name": "string",
  "*email": "string",
  "arr": [{
    "site": "string",
    "url": "string"
  }]
}

```

Output:

```json
{
  "type": "object",
  "required": [
    "name",
    "email"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "arr": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [],
        "properties": {
          "site": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

### Advance

Input:

```json
{
  "*id": "string",
  "*name": {
    "type": "string",
    "enum": [
      "tom",
      "jay"
    ],
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
  ],
  "abc": {
    "a": {
      "x": "string",
      "y": {
        "type": "number",
        "minimum": 400000,
        "maximum": 900000
      }
    }
  }
}
```

Output:

```json
{
  "type": "object",
  "required": [
    "id",
    "name",
    "images"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "enum": [
        "tom",
        "jay"
      ],
      "minLength": 1,
      "maxLength": 10
    },
    "images": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id"
        ],
        "properties": {
          "id": {
            "type": "number"
          },
          "names": {
            "type": "array",
            "title": "Images Collections.",
            "items": {
              "type": "object",
              "required": [
                "id",
                "name"
              ],
              "properties": {
                "id": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "abc": {
      "type": "object",
      "required": [],
      "properties": {
        "a": {
          "type": "object",
          "required": [],
          "properties": {
            "x": {
              "type": "string"
            },
            "y": {
              "type": "number",
              "minimum": 400000,
              "maximum": 900000
            }
          }
        }
      }
    }
  }
}
```

TODO

- [x] Base Project set up and package update
- [] Add Nav bar and footer components
- [] Language switch
- [] Theme switch

<https://app.blackbox.ai/chat/7SilKKP>

I am about to do a new project, a karate dsl json schema converter, which is a tool where user can paste or upload a json and then the tool will convert it to a valid json schema for karate dsl which we know is different to an actual json schema.

Now, as a start anb before going in deep with requirements I need you to modify a base project that already takes a json to convert it into a json schema as we know it. I want:

1. Update dependencies in package.json
2. Include react and react boostrap and vite if necessary and any other dependency necessary for the project
3. Modernize the frontend style but don't change structure just yet, only to use react bootstrap and be responsive
4. Organize the existing code using functional components and modern javascript/react good practices
5. Create a project summary based on this new changes that highlights the project new folder structure, what is it about and tech stack.

Here's the structure and code:

```console

├─ index.js
├─ index.test.js
├─ index.html
├─ .gitignore
├─ package.json
```

-----

### Project Summary

#### Project Name:** Karate JSON Schema Converter (Frontend Foundation)

#### Description

This project is the foundational frontend for a tool designed to convert standard JSON structures into JSON Schemas compatible with the Karate DSL testing framework. The current version modernizes the legacy vanilla JS implementation into a scalable React application. It provides a user-friendly interface to paste JSON, visualize the generated schema, and prepare the ground for future Karate-specific schema transformations.

#### **Tech Stack**

- **Build Tool:** Vite (Fast, modern bundler)

- **Framework:** React 18 (Functional Components, Hooks)

- **UI Library:** React Bootstrap 5 (Responsive, accessible components)

- **Code Editor:** React-Ace (Ace Editor wrapper for JSON syntax highlighting)

- **Testing:** AVA (Node.js test runner)

- **Language:** Modern JavaScript (ES Modules)

#### New Folder Structure

```text
├─ public/
│  └─ index.html          # Minimal HTML entry point
├─ src/
│  ├─ components/
│  │  └─ JsonEditor.jsx   # Reusable Ace Editor wrapper
│  ├─ utils/
│  │  └─ schemaConverter.js # Core conversion logic (extracted from index.js)
│  ├─ App.jsx             # Main Application Logic
│  ├─ main.jsx            # React Entry Point
│  └─ index.css           # Global Styles
├─ index.test.js           # Unit Tests (Updated path)
├─ package.json            # Dependencies & Scripts
├─ vite.config.js          # Vite Configuration
└─ .gitignore
```

#### Key Improvements

1. **Component Architecture:** Logic is separated from UI. The `schemaConverter.js` can be tested independently of the React UI.
2. **Responsiveness:** The layout now uses Bootstrap's Grid system (`Col md={6}`), making it work on mobile and desktop.
3. **Modern Syntax:** Replaced `var` with `const`/`let`, and used ES.
