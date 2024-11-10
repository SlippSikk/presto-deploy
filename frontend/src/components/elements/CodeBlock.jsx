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

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

const CodeBlock = ({ code, language, fontSize }) => {
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
          overflow: 'hidden', // Allow scrolling if content exceeds
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
  language: PropTypes.oneOf(['javascript', 'python', 'c']).isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default CodeBlock;
