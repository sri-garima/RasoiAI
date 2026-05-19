import { AppNav } from "@/components/app/AppNav";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-cream text-stone-900">
      <AppNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
