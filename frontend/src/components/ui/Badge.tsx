interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  const variants = {
    default: 'bg-surface-hover text-zinc-300',
    accent: 'bg-accent/15 text-accent-hover',
    success: 'bg-success/15 text-success',
    warning: 'bg-amber-500/15 text-amber-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};
