// app/layout.tsx
import Header from '@/components/Header'
import AuthBar from '@/components/AuthBar' // ログインバーを追加する場合
import Footer from '@/components/Footer'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-800 font-sans antialiased">
        <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col justify-between">
          <div>
            <Header />
            <AuthBar /> {/* ヘッダーの直下にログイン・新規登録バーを配置 */}
          </div>

          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </div>
      </body>
    </html>
  )
}