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
    <SyntaxHighlighter language={language} style={github} customStyle={{ fontSize: `${fontSize}em`, height: '100%', overflow: 'auto' }}>
      {code}
    </SyntaxHighlighter>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.oneOf(['javascript', 'python', 'c']).isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default CodeBlock;
