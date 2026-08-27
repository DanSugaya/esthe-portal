'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthBar() {
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 初期セッションの取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの状態変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 判定条件：読み込み中、ログインページ（/login）、またはログイン済みの場合は非表示にする
  if (loading || pathname === '/login' || session) {
    return null
  }

  return (
    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex w-full gap-2">
        <Link 
          href="/login" 
          className="flex-1 py-1.5 text-xs font-bold text-center text-blue-600 bg-white border border-blue-600 rounded"
        >
          ログイン
        </Link>
        <Link 
          href="/register" 
          className="flex-1 py-1.5 text-xs font-bold text-center text-white bg-blue-600 border border-blue-600 rounded"
        >
          新規会員登録
        </Link>
      </div>
    </div>
  )
}