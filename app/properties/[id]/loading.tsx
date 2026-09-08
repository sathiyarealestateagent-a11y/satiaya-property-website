export default function PropertyLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-background">
      <div className="h-[72px] border-b border-border bg-white" />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="h-4 w-56 rounded bg-muted" />
        <div className="mt-6 aspect-[4/3] min-h-[300px] rounded-[24px] bg-muted sm:aspect-[16/9] lg:aspect-[2.15/1]" />
        <div className="mt-8 h-10 w-3/4 rounded bg-muted" />
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </main>
  );
}
