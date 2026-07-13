import Link from "next/link";

export const metadata = {
  title: "Offline",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="font-display text-3xl font-bold text-foreground">
        You&apos;re offline
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Daily Bible Reader needs a connection to load scripture. Check your
        network, then try again.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
