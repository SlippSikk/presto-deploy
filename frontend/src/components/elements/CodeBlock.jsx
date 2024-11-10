// src/components/elements/CodeBlock.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import languages you need
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Register the languages with SyntaxHighlighter
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

// Helper function to detect language
const detectLanguage = (code) => {
  // Simple heuristics to determine the language
  const cPattern = /#include\s*<.*?>|int\s+main\s*\(/;
  const pythonPattern = /^\s*def\s+\w+\s*\(.*\):|import\s+\w+/m;
  const jsPattern = /function\s+\w+\s*\(.*\)\s*{|console\.log\s*\(/;

  if (cPattern.test(code)) {
    return 'c';
  } else if (pythonPattern.test(code)) {
    return 'python';
  } else if (jsPattern.test(code)) {
    return 'javascript';
  } else {
    return 'plaintext'; // Fallback if none match
  }
};

const CodeBlock = ({ code, fontSize }) => {
  const language = detectLanguage(code);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden', // Prevent overflow in all directions
        fontSize: `${fontSize}em`,
        boxSizing: 'border-box',
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={github}
        customStyle={{
          margin: 0,
          padding: '0.5em',
          height: '100%',
          overflow: 'hidden', // Ensure content is clipped
          boxSizing: 'border-box',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default CodeBlock;
