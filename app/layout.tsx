import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/components/contexts/LanguageContext';
import { ThemeProvider } from '@/components/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BloodConnect - Connecting Blood Donors with Recipients',
  description: 'A modern platform to connect blood donors with recipients, hospitals, and clinics. Save lives through efficient blood donation matching.',
  keywords: 'blood donation, blood donor, blood recipient, hospital, emergency, health, medical',
  authors: [{ name: 'BloodConnect Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}