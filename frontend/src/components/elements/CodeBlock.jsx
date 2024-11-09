// src/components/elements/CodeBlock.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

const CodeBlock = ({ code, language, fontSize }) => {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <SyntaxHighlighter
        language={language}
        style={github}
        customStyle={{
          fontSize: `${fontSize}em`,
          whiteSpace: 'pre-wrap', // Allows code to wrap; use 'pre' to prevent wrapping
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 10, // Limit to 10 lines; adjust as needed
          WebkitBoxOrient: 'vertical',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.oneOf(['javascript', 'python', 'c']).isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default CodeBlock;
