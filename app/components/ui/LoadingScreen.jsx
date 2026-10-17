// Basit tam sayfa yükleme ekranı.
export default function LoadingScreen({ message }) {
  return (
    <div className="w-full bg-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <svg
        className="w-6 h-6 text-accent animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-body-sm text-text-muted font-mono">{message}</p>
    </div>
  );
}
