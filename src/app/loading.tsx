export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-bg">
      <div className="flex items-center gap-3 text-primary">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium">Memuat SehatJiwa...</span>
      </div>
    </div>
  );
}
