export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 px-4 py-8 text-center text-sm text-slate-400">
      <p>
        &copy; {year} Daily Bible Reader. Built by BigMitchT.
      </p>
    </footer>
  );
}
