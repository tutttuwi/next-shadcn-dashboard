import type { Metadata } from 'next';
import { Toaster } from '@/features/calendar/components/ui/toaster';
import { ThemeProvider } from '@/features/calendar/components/theme-provider';
// import "./globals.css";
import Footer from '@/features/calendar/components/footer';

export const metadata: Metadata = {
  title: 'ShadCn FullCalendar Example',
  description: 'An example template on how to use ShadCn FullCalendar.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body>
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
      {/* <Footer /> */}
    </ThemeProvider>
    //   </body>
    // </html>
  );
}
