export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse bg-gray-50 pb-20">
      <div className="border-b border-gray-800 bg-secondary px-4 py-16">
        <div className="container mx-auto space-y-4">
          <div className="h-6 w-48 bg-white/10" />
          <div className="h-14 max-w-xl bg-white/10" />
          <div className="h-6 max-w-2xl bg-white/10" />
          <div className="grid gap-4 pt-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-8 px-4 py-10 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-4 border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-28 bg-gray-200" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-11 bg-gray-100" />
              <div className="h-11 bg-gray-100" />
            </div>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-11 bg-gray-100" />
            ))}
          </div>
          <div className="space-y-4 border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-40 bg-gray-200" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 bg-gray-100" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="hidden min-h-[520px] border border-gray-200 bg-white lg:block" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[160px_minmax(0,1fr)]">
                <div className="h-36 bg-gray-100" />
                <div className="space-y-4">
                  <div className="h-5 w-24 bg-gray-100" />
                  <div className="h-10 w-full bg-gray-200" />
                  <div className="h-5 w-3/4 bg-gray-100" />
                  <div className="h-20 bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
