export const Spinner = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <div className="flex items-center justify-center py-12">
    <div
      className={`${className} animate-spin rounded-full border-2 border-accent border-t-transparent`}
    />
  </div>
);

export const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Spinner />
  </div>
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="mb-4 text-4xl opacity-50">📝</div>
    <h3 className="text-lg font-semibold text-zinc-200">{title}</h3>
    {description ? <p className="mt-2 max-w-sm text-sm text-muted">{description}</p> : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);
