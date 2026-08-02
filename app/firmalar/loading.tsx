export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="h-56 animate-pulse bg-secondary/90" />
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="h-[420px] animate-pulse border border-gray-200 bg-white" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="h-80 animate-pulse border border-gray-200 bg-white" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
