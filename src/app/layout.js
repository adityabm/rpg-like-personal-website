import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | The Guild Hall",
    default: "Aditya Dewantara | Fullstack Adventurer's Tavern",
  },
  description: 'Step into the guild hall of Aditya Dewantara, a Fullstack Spellcaster weaving React and Next.js enchantments to craft legendary web experiences.',
  keywords: ['Aditya Dewantara', 'Fullstack Developer', 'Frontend Developer', 'React', 'Next.js', 'RPG Portfolio', 'Web Development', 'Tavern'],
  authors: [{ name: 'Aditya Dewantara' }],
  creator: 'Aditya Dewantara',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adit.dev/', // Replace with your actual domain
    title: "Aditya Dewantara | Fullstack Adventurer's Tavern",
    description: 'Step into the guild hall of Aditya Dewantara, a Fullstack Spellcaster weaving React and Next.js enchantments to craft legendary web experiences.',
    siteName: "Aditya's Guild Hall",
    images: [
      {
        url: '/og-image.jpg', // Ensure you have an og-image.jpg in your public directory
        width: 1200,
        height: 630,
        alt: "Aditya Dewantara | Fullstack Adventurer's Tavern",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aditya Dewantara | Fullstack Adventurer's Tavern",
    description: 'Step into the guild hall of Aditya Dewantara, a Fullstack Spellcaster weaving React and Next.js enchantments to craft legendary web experiences.',
    creator: '@dwntradit', // Update with your actual Twitter handle if needed
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico', // Make sure you have this in /public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
