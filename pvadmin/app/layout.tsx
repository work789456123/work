import AppLayout from "@/components/AppLayout";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden text-slate-800 antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}