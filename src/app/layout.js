import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'InfoTern - UIT Internship Information Platform',
  description: 'Helping UIT students make informed internship decisions through real reviews, company insights, and senior connections. Find the best internship match for your major.',
  keywords: 'UIT, internship, Myanmar, software engineering, cybersecurity, knowledge engineering, reviews',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-height)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
