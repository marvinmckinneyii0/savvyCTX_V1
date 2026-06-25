import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'SavvyCortex — Operational Intelligence for Data Teams',
  description: 'AI-powered data quality assessment, drift detection, insight generation, and professional reporting. Powered by the SCX Intelligence Engine.',
  openGraph: {
    title: 'SavvyCortex — Operational Intelligence for Data Teams',
    description: 'Turn your data into decisions with SavvyCortex. Data quality, drift detection, insights, and automated reports.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
