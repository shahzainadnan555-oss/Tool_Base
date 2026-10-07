interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-tm-border bg-tm-elevated px-6 py-14 text-center">
      <h2 className="text-xl font-bold text-tm-text">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-base font-medium text-tm-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
