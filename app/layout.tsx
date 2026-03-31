// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YTA — YouTube Automation Dashboard',
  description: 'Automated YouTube video production pipeline',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 fixed">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-white">YTA</h1>
              <p className="text-xs text-slate-500">YouTube Automation</p>
            </div>
            <nav className="space-y-1">
              {[
                { href: '/dashboard', icon: 'D', label: 'Dashboard' },
                { href: '/jobs', icon: 'J', label: 'Jobs' },
                { href: '/review', icon: 'R', label: 'Review' },
                { href: '/analytics', icon: 'A', label: 'Analytics' },
                { href: '/settings', icon: 'S', label: 'Settings' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="ml-64 flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
