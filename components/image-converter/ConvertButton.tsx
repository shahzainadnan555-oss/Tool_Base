"use client";

interface ConvertButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  label?: string;
  loadingLabel?: string;
}

export function ConvertButton({
  disabled = false,
  loading = false,
  onClick,
  label = "Convert",
  loadingLabel = "Converting...",
}: ConvertButtonProps) {
  return (
    <button
      type="button"
      className="tm-btn tm-btn-primary min-w-44 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
