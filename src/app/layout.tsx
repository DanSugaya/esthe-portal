// app/layout.tsx
import Header from '@/components/Header'
import AuthBar from '@/components/AuthBar'
import Footer from '@/components/Footer'
import './globals.css'
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-800 font-sans antialiased">
        {/* ↓ bodyの直下に noscript タグを配置 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M5244CG5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col justify-between">
          <div>
            <Header />
            <AuthBar />
          </div>

          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </div>
      </body>
      <GoogleTagManager gtmId="GTM-M5244CG5" />
    </html>
  )
}