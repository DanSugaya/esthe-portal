import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createClient()

  // ログイン中のユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* ロゴ / サイト名 */}
        <Link href="/" className="text-xl font-bold text-emerald-600 hover:opacity-80 transition">
          埼玉メンズエステ情報館
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition"
          >
            サロンを探す
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l pl-4">
              <span className="text-xs text-gray-500 max-w-[150px] truncate">
                {user.email}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition shadow-sm"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}