// src/components/JsonEditor.jsx
import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

const JsonEditor = ({ value, onChange, readOnly = false, height = '500px', isError = false }) => {
  return (
    <AceEditor
      mode="json"
      theme="monokai"
      name="json-editor"
      onChange={onChange}
      value={value}
      readOnly={readOnly}
      width="100%"
      height={height}
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
      style={{
        border: isError ? '2px solid #dc3545' : '1px solid #dee2e6',
        borderRadius: '4px',
      }}
    />
  );
};

export default JsonEditor;