'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 認証状態の変更検知
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // 非表示条件:
  // 1. ローディング中
  // 2. ログイン済み
  // 3. 一般ユーザー認証系ページ (/login, /register)
  // 4. 店舗オーナー系ページ (/owner/...)
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/owner')

  if (loading || session || isAuthPage) {
    return null
  }

  return (
    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex w-full gap-2">
        <Link
          href="/login"
          className="flex-1 py-1.5 text-xs font-bold text-center text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50 transition"
        >
          ログイン
        </Link>
        <Link
          href="/register"
          className="flex-1 py-1.5 text-xs font-bold text-center text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 transition"
        >
          新規会員登録
        </Link>
      </div>
    </div>
  )
}