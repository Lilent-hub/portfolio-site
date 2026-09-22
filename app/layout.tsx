import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { getProfile } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/** Title and description follow the profile, so admin edits reach search and shared links. */
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name ?? "Portfolio";
  const shortName = name.split(/\s+/).slice(0, 1).concat(name.split(/\s+/).slice(-1)).join(" ");

  return {
    title: {
      default: profile?.headline ? `${name} — ${profile.headline}` : name,
      template: `%s · ${shortName}`,
    },
    description: profile?.tagline ?? undefined,
    openGraph: {
      title: profile?.headline ? `${name} — ${profile.headline}` : name,
      description: profile?.tagline ?? undefined,
      type: "website",
      images: profile?.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
