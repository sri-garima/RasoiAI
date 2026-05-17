import { AppNav } from "@/components/app/AppNav";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-cream text-stone-900">
      <AppNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200/70 bg-white/60 py-4 text-center text-xs text-stone-500">
        Phase 2 — app shell preview. Forms and data arrive in later phases.
      </footer>
    </div>
  );
}
