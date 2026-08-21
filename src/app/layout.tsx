import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'エステポータル | お気に入りのサロンが見つかる',
  description: 'おすすめのエステサロンと施術メニューの予約ポータル',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-slate-50 text-gray-900 min-h-screen flex flex-col`}>
        {/* 共通ヘッダー */}
        <Header />
        
        {/* メインコンテンツ */}
        <div className="flex-1">
          {children}
        </div>

        {/* フッター */}
        <footer className="border-t bg-white py-6 text-center text-xs text-gray-500 mt-12">
          &copy; {new Date().getFullYear()} Esthe Portal. All rights reserved.
        </footer>
      </body>
    </html>
  )
}