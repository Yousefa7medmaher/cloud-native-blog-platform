import { useRef, useCallback } from 'react';
import { Button } from '../ui/Button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const tools = [
  { cmd: 'bold', label: 'B', title: 'Bold' },
  { cmd: 'italic', label: 'I', title: 'Italic' },
  { cmd: 'underline', label: 'U', title: 'Underline' },
  { cmd: 'formatBlock', arg: 'h2', label: 'H2', title: 'Heading' },
  { cmd: 'insertUnorderedList', label: '•', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1.', title: 'Numbered list' },
  { cmd: 'formatBlock', arg: 'blockquote', label: '"', title: 'Quote' },
];

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            variant="ghost"
            size="sm"
            title={tool.title}
            onClick={() => exec(tool.cmd, tool.arg)}
            className="min-w-[32px] font-bold"
          >
            {tool.label}
          </Button>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={insertLink}>
          Link
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        className="prose-blog min-h-[300px] max-w-none p-4 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted"
      />
    </div>
  );
};
