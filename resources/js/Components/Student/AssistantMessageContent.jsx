import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AssistantMessageContent({ content }) {
    if (!content) {
        return null;
    }

    return (
        <div className="student-review-assistant__markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                p: ({ children }) => <p className="student-review-assistant__md-p">{children}</p>,
                strong: ({ children }) => <strong className="student-review-assistant__md-strong">{children}</strong>,
                em: ({ children }) => <em className="student-review-assistant__md-em">{children}</em>,
                h1: ({ children }) => <h3 className="student-review-assistant__md-heading">{children}</h3>,
                h2: ({ children }) => <h4 className="student-review-assistant__md-heading">{children}</h4>,
                h3: ({ children }) => <h5 className="student-review-assistant__md-heading">{children}</h5>,
                ul: ({ children }) => <ul className="student-review-assistant__md-list">{children}</ul>,
                ol: ({ children }) => <ol className="student-review-assistant__md-list student-review-assistant__md-list--ordered">{children}</ol>,
                li: ({ children }) => <li className="student-review-assistant__md-list-item">{children}</li>,
                code: ({ inline, children }) =>
                    inline ? (
                        <code className="student-review-assistant__md-code">{children}</code>
                    ) : (
                        <code className="student-review-assistant__md-code-block">{children}</code>
                    ),
                pre: ({ children }) => <pre className="student-review-assistant__md-pre">{children}</pre>,
                a: ({ href, children }) => (
                    <a href={href} className="student-review-assistant__md-link" target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
            }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
