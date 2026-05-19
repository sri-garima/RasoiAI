import { AppChrome } from "@/components/app/AppChrome";
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppChrome>{children}</AppChrome>
    </AuthProvider>
  );
}
