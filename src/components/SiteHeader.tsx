import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="relative min-h-[50vh] max-h-[70vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/header.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-[50vh] max-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center text-white">
        <div className="flex max-w-xl flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <Image
              src="/images/read1.jpeg"
              alt="Daily Bible Reader logo"
              width={80}
              height={80}
              className="rounded-full border-[3px] border-white/30 shadow-lg"
              priority
            />
            <div>
              <h1 className="bg-gradient-to-br from-white to-slate-200 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                Daily Bible Reader
              </h1>
              <p className="mt-2 text-lg font-light text-white/90">
                Your daily journey through scripture
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Image
              src="/images/down1.png"
              alt="Scroll down"
              width={40}
              height={40}
              className="animate-bounce opacity-80"
            />
            <span className="text-sm font-light text-white/70">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
