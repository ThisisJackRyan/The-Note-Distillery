import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/header';
import { AuthProvider } from './context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Note Distillery",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-900 h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white h-full flex flex-col`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">
          {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
