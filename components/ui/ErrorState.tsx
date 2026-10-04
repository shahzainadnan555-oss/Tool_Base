interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, use Report a Problem from the tool page.",
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="tm-notice tm-notice-error px-6 py-10 text-center"
    >
      <h2 className="text-xl font-bold text-tm-error">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-base font-medium text-tm-text/80">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
