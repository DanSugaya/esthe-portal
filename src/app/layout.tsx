// app/layout.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css' // Tailwindの読み込み

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-800 font-sans antialiased">
        <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col justify-between">
          {/* 全ページ共通ヘッダー */}
          <Header />

          {/* 各ページの中身（page.tsx の内容がここに入る） */}
          <div className="flex-1">
            {children}
          </div>

          {/* 全ページ共通フッター */}
          <Footer />
        </div>
      </body>
    </html>
  )
}