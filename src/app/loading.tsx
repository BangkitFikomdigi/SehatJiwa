export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-primary-lighter" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-white shadow-soft" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-xl bg-white shadow-soft" />
    </div>
  );
}
