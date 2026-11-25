import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Flow — Learn at your own pace",
  description: "A calm, clear space to build your English every day.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}