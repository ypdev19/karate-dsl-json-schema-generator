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

## Base

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

## Advance

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
- [x] Add Nav bar and footer components
- [x] Language switch
- [x] Theme switch
- [x] UI improvements
- [x] Change log page
- [x] About page
- [x] Verify responsiveness
- [] i18n content check
- [] Unit tests
- [] Pre prod testing
- [] Prod testing

Important to keep under consideration for what we're going to do:

- Provide comments in the code.
- Keep the good practice of implementing functional components.
- Follow coding best practices.
- If you need an existing code, ask for it.
- By the time we complete this part, update this same prompt (project structure, project summary)


-----------------------------
-----------------------------

Business Value: Saves **hours of manual Karate schema creation** per tester. Provides production-grade UX with theming, internationalization readiness, and persistent settings. Enables rapid API test development with consistent DSL syntax across global teams. Perfect onboarding tool for Karate Framework adoption.
