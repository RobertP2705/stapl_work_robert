"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "cpp", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting for C++/STAPL
  const highlightCode = (code: string): string => {
    const keywords = /\b(auto|const|return|template|typename|void|int|bool|class|struct|namespace|using|for|if|else|while|public|private|static)\b/g;
    const types = /\b(stapl::array|stapl::map|stapl::list|std::vector|std::map|std::string)\b/g;
    const functions = /\b(stapl::\w+|make_array_view|generate|transform|accumulate|reduce|map_func|for_each|sort|find)\b/g;
    const strings = /(["'])((?:\\.|[^\\])*?)\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const numbers = /\b(\d+)\b/g;

    let result = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    result = result.replace(comments, '<span class="token-comment">$1</span>');
    result = result.replace(strings, '<span class="token-string">$1$2$1</span>');
    result = result.replace(keywords, '<span class="token-keyword">$1</span>');
    result = result.replace(types, '<span class="token-type">$1</span>');
    result = result.replace(functions, '<span class="token-function">$1</span>');
    result = result.replace(numbers, '<span class="token-number">$1</span>');

    return result;
  };

  return (
    <div className="code-block group relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            {filename || language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4">
        <code
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
        />
      </pre>
    </div>
  );
}
