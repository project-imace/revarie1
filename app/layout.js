import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'PsyCoSys Synapsys | Revarie LM v1',
  description: '14-day psychological computation study',
  icons: {
    icon: 'https://assets.imace.online/image/psysynapicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground font-body">
        <div className="flex flex-col min-h-[100dvh]">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
