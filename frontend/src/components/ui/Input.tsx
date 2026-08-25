import clsx from 'clsx';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={clsx(
          'w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-zinc-100',
          'placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50',
          'transition-colors duration-200',
          error && 'border-danger focus:border-danger focus:ring-danger/50',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  ),
);

Input.displayName = 'Input';
