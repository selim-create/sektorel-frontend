export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse bg-gray-50 pb-20">
      <div className="border-b border-gray-800 bg-secondary px-4 py-16">
        <div className="container mx-auto space-y-4">
          <div className="h-6 w-40 bg-white/10" />
          <div className="h-14 max-w-xl bg-white/10" />
          <div className="h-6 max-w-2xl bg-white/10" />
        </div>
      </div>

      <div className="container mx-auto space-y-8 px-4 py-10">
        <div className="grid gap-4 rounded-none border border-gray-200 bg-white p-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="space-y-3" key={index}>
              <div className="h-4 w-24 bg-gray-200" />
              <div className="h-12 bg-gray-100" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
          <div className="grid min-h-[420px] border border-gray-200 bg-white md:grid-cols-2">
            <div className="bg-gray-200" />
            <div className="space-y-4 p-8">
              <div className="h-5 w-32 bg-gray-200" />
              <div className="h-10 w-full bg-gray-200" />
              <div className="h-10 w-3/4 bg-gray-100" />
              <div className="h-24 w-full bg-gray-100" />
            </div>
          </div>

          <div className="space-y-4 border border-gray-200 bg-white p-6">
            <div className="h-8 w-40 bg-gray-200" />
            <div className="h-28 bg-gray-100" />
            <div className="h-28 bg-gray-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="overflow-hidden border border-gray-200 bg-white" key={index}>
              <div className="h-56 bg-gray-200" />
              <div className="space-y-4 p-6">
                <div className="h-4 w-24 bg-gray-200" />
                <div className="h-8 w-full bg-gray-200" />
                <div className="h-16 w-full bg-gray-100" />
                <div className="h-10 w-32 bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
