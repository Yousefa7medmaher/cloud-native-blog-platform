import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className, hover, onClick }: CardProps) => (
  <div
    onClick={onClick}
    className={clsx(
      'rounded-xl border border-border bg-surface-elevated p-5',
      hover && 'transition-all duration-200 hover:border-accent/30 hover:bg-surface-hover cursor-pointer',
      className,
    )}
  >
    {children}
  </div>
);

export const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon?: ReactNode;
}) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold text-zinc-100">{value}</p>
      </div>
      {icon ? <div className="text-accent">{icon}</div> : null}
    </div>
  </Card>
);
