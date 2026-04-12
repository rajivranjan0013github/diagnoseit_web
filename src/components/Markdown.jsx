'use client';

import ReactMarkdown from 'react-markdown';
import { cleanText } from '@/lib/utils';

export const Markdown = ({ children, className = '' }) => (
    <div className="whitespace-pre-wrap">
        <ReactMarkdown
            components={{
                p: ({ children }) => <div className={`mb-1.5 last:mb-0 ${className}`}>{children}</div>,
                strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
            }}
        >
            {cleanText(children)}
        </ReactMarkdown>
    </div>
);
