import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* ロゴ / サイト名 */}
        <Link href="/" className="text-xl font-bold text-emerald-600 hover:opacity-80 transition">
          Esthe Portal
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition"
          >
            サロンを探す
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition shadow-sm"
          >
            ログイン
          </Link>
        </nav>
      </div>
    </header>
  )
}