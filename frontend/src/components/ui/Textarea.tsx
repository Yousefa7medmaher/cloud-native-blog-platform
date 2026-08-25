import clsx from 'clsx';
import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={id}
        className={clsx(
          'w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-zinc-100',
          'placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50',
          'transition-colors duration-200 resize-y min-h-[100px]',
          error && 'border-danger',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  ),
);

Textarea.displayName = 'Textarea';
