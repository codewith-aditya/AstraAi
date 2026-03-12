import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import '../styles/MessageContent.css';

const MessageContent = ({ content, role }) => {
  const [copiedCode, setCopiedCode] = React.useState({});

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode({ ...copiedCode, [index]: true });
    setTimeout(() => {
      setCopiedCode({ ...copiedCode, [index]: false });
    }, 2000);
  };

  const customStyle = {
    background: 'rgba(20, 10, 40, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    margin: '12px 0',
    fontSize: '14px',
    lineHeight: '1.6',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(181, 55, 242, 0.2)',
  };

  let codeBlockIndex = 0;

  return (
    <div className={`message-content-wrapper ${role}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const currentIndex = codeBlockIndex++;

            if (!inline && match) {
              return (
                <div className="code-block-wrapper">
                  <div className="code-header">
                    <span className="code-language">{match[1]}</span>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(codeString, currentIndex)}
                    >
                      {copiedCode[currentIndex] ? (
                        <>
                          <Check size={14} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={customStyle}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className={`inline-code ${className}`} {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="markdown-paragraph">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="markdown-h1">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="markdown-h2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="markdown-h3">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="markdown-list">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="markdown-list ordered">{children}</ol>;
          },
          li({ children }) {
            return <li className="markdown-list-item">{children}</li>;
          },
          blockquote({ children }) {
            return <blockquote className="markdown-blockquote">{children}</blockquote>;
          },
          a({ href, children }) {
            return (
              <a href={href} className="markdown-link" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          table({ children }) {
            return <table className="markdown-table">{children}</table>;
          },
          thead({ children }) {
            return <thead className="markdown-thead">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="markdown-tbody">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="markdown-tr">{children}</tr>;
          },
          td({ children }) {
            return <td className="markdown-td">{children}</td>;
          },
          th({ children }) {
            return <th className="markdown-th">{children}</th>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
