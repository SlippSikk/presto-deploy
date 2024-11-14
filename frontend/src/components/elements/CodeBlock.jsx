import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import highlight from 'highlight.js/lib/core';

// Import additional languages as needed
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';
// Add more languages here

// Register languages with highlight.js
highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('python', python);
highlight.registerLanguage('c', c);
// Register additional languages here

const CodeBlock = ({ code, fontSize, language: explicitLanguage }) => {
  const [language, setLanguage] = useState(explicitLanguage || 'plaintext');

  useEffect(() => {
    if (!explicitLanguage) {
      const detectedLanguage = highlight.highlightAuto(code).language || 'plaintext';
      setLanguage(detectedLanguage);
    }
  }, [code, explicitLanguage]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto', // Allow scrolling if content overflows
        fontSize: `${fontSize}em`,
        boxSizing: 'border-box',
        backgroundColor: '#f6f8fa', // Optional: match the github theme background
        overflow: 'hidden',

      }}
    >
      <SyntaxHighlighter
        language={language}
        style={github}
        wrapLines
        customStyle={{
          margin: 0,
          padding: '0.7em',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};

CodeBlock.defaultProps = {
  fontSize: 1, // Default font size
  language: null, // Default to auto-detection
};

export default CodeBlock;
