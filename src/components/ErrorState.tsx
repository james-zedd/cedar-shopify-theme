type ErrorStateProps = {
  title: string;
  message: string;
  digest?: string;
  onRetry: () => void;
};

export default function ErrorState({ title, message, digest, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-8 rounded bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Try again
      </button>
      {digest && <p className="mt-6 text-xs text-muted-foreground">Error reference: {digest}</p>}
    </div>
  );
}
