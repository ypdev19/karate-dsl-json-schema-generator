/**
 * src/components/JsonEditor.jsx
 * DO NOT DELETE THIS HEADER COMMENT
 * 
 * Reusable editor wrapper around Ace Editor. 
 * Ace Editor (input/output + error borders).
 * Responsibilities: JSON editing, syntax highlighting, read-only output rendering, error border visualization
 * Features: Monokai theme, live editing, configurable height, validation styling.
 * 
 */
import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';     // Dark
import 'ace-builds/src-noconflict/theme-tomorrow';    // Light
import 'ace-builds/src-noconflict/theme-tomorrow_night'; // Dark alt
import 'ace-builds/src-noconflict/ext-language_tools';

const JsonEditor = ({ 
  value, 
  onChange, 
  height, 
  readOnly = false, 
  isError = false, 
  themeMode = 'dark'  // New prop!
}) => {
  const aceRef = useRef(null);

  // Ace theme mapping
  const getAceTheme = (mode) => {
    return mode === 'dark' ? 'tomorrow_night' : 'chrome';
  };

  const aceTheme = getAceTheme(themeMode);

  useEffect(() => {
    if (aceRef.current?.editor) {
      aceRef.current.editor.setReadOnly(readOnly);
    }
  }, [readOnly]);

  return (
    <div className={`ace-container h-100 ${themeMode}`}>
      <AceEditor
        ref={aceRef}
        mode="json"
        theme={aceTheme}
        value={value}
        onChange={onChange}
        name="json-editor"
        editorProps={{ $blockScrolling: true }}
        height={height}
        width="100%"
        showPrintMargin={false}
        showGutter={!readOnly}
        highlightActiveLine={!readOnly}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        className={isError ? 'border-danger' : ''}
        style={{ borderRadius: '0.375rem' }}
      />
    </div>
  );
};

export default JsonEditor;