import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'CBC Adapt',
  description: 'Adaptive CBC learning and question intelligence platform',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
