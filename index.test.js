// index.test.js
import test from 'ava';
import { 
  convertJsonToKarate, 
  convertToKarateSchema, 
  convertObjectToKarate,
  generateKarateSnippet 
} from './src/utils/schemaConverter.js';

// Test 1: Simple Object Conversion
test('simple object conversion', t => {
  const input = {
    "id": 101,
    "name": "Alice",
    "active": true
  };
  
  const expected = `{
  id: '#number',
  name: '#string',
  active: '#boolean'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 2: Nested Object Conversion
test('nested object conversion', t => {
  const input = {
    "user": {
      "id": 10,
      "email": "user@mail.com"
    },
    "verified": true
  };
  
  const expected = `{
  user: {
    id: '#number',
    email: '#string'
  },
  verified: '#boolean'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 3: Array of Primitives
test('array of primitives', t => {
  const input = {
    "roles": ["admin", "user"]
  };
  
  const expected = `{
  roles: '#[] #string'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 4: Array of Objects
test('array of objects', t => {
  const input = {
    "users": [
      {
        "id": 1,
        "name": "John"
      }
    ]
  };
  
  const expected = `{
  users: '#[] { id: "#number", name: "#string" }'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 5: Nested Arrays
test('nested arrays', t => {
  const input = {
    "matrix": [[1, 2], [3, 4]]
  };
  
  const expected = `{
  matrix: '#[] #[] #number'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 6: Empty Array
test('empty array', t => {
  const input = {
    "users": []
  };
  
  const expected = `{
  users: '#array'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 7: Optional Mode
test('optional mode conversion', t => {
  const input = {
    "id": 101,
    "name": "Alice"
  };
  
  const expected = `{
  id: '##number',
  name: '##string'
}`;
  
  t.is(convertJsonToKarate(input, true), expected);
});

// Test 8: Mixed Types
test('mixed types conversion', t => {
  const input = {
    "id": 101,
    "name": "Alice",
    "active": true,
    "roles": ["admin", "user"],
    "user": {
      "email": "alice@example.com"
    }
  };
  
  const expected = `{
  id: '#number',
  name: '#string',
  active: '#boolean',
  roles: '#[] #string',
  user: {
    email: '#string'
  }
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 9: Karate DSL Snippet Generation
test('karate snippet generation', t => {
  const schema = `{
  id: '#number',
  name: '#string'
}`;
  
  const expected = `* def schema =
{
  id: '#number',
  name: '#string'
}

* match response == schema`;
  
  t.is(generateKarateSnippet(schema), expected);
});

// Test 10: Boolean Type
test('boolean type conversion', t => {
  const input = {
    "active": true,
    "deleted": false
  };
  
  const expected = `{
  active: '#boolean',
  deleted: '#boolean'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 11: Deeply Nested Objects
test('deeply nested objects', t => {
  const input = {
    "level1": {
      "level2": {
        "level3": {
          "value": "test"
        }
      }
    }
  };
  
  const expected = `{
  level1: {
    level2: {
      level3: {
        value: '#string'
      }
    }
  }
}`;
  
  t.is(convertJsonToKarate(input), expected);
});

// Test 12: Array with Mixed Primitives (should use first element type)
test('array with mixed primitives', t => {
  const input = {
    "mixed": [1, "string", true]
  };
  
  const expected = `{
  mixed: '#[] #number'
}`;
  
  t.is(convertJsonToKarate(input), expected);
});