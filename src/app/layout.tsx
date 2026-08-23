import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
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

        {/* 共通フッター */}
        <footer className="border-t bg-white pt-10 pb-6 mt-12 border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
              {/* サービス紹介 */}
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-2">Esthe Portal</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  お気に入りのエステサロンや施術メニューが手軽に見つかる予約ポータルサイトです。
                </p>
              </div>

              {/* ユーザー向けナビ */}
              <div>
                <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-3">
                  サービス
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-emerald-600 transition">
                      サロンを探す
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-gray-600 hover:text-emerald-600 transition">
                      ログイン / 会員登録
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 店舗様向けナビ */}
              <div>
                <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-3">
                  サロンオーナー様へ
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link
                      href="/owner/auth"
                      className="text-emerald-600 hover:underline font-medium transition"
                    >
                      掲載のお申し込み・店舗ログイン
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* コピーライト */}
            <div className="border-t border-slate-100 pt-6 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Esthe Portal. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}