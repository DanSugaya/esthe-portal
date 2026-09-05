'use client'

import { useMemo, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OwnerPendingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(false)

  // SupabaseクライアントをMemo化して再生成を防止
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/owner/login')
    router.refresh()
  }

  // ステータスの再確認処理
  const handleCheckStatus = async () => {
    setChecking(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/owner/login')
        return
      }

      const { data: salon } = await supabase
        .from('salons')
        .select('status')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (salon?.status === 'approved') {
        alert('承認が完了しています！ダッシュボードへ移動します。')
        router.push('/owner/dashboard')
      } else {
        alert('現在も確認・審査中です。しばらくお待ちください。')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('ステータス確認エラー:', err.message)
      }
    } finally {
      setChecking(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        
        {/* ステータスアイコン */}
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ！
        </div>

        <h1 className="text-lg font-bold text-slate-800 mb-2">
          掲載申請を受け付けました
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          現在、運営事務局にて内容の確認を行っております。<br />
          承認が完了するまで今しばらくお待ちください。
        </p>

        <div className="space-y-2">
          {/* ステータス手動確認ボタン */}
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition disabled:opacity-50 cursor-pointer"
          >
            {checking ? '確認中...' : '最新のステータスを確認'}
          </button>

          <Link
            href="/"
            className="block w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
          >
            トップページへ戻る
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            ログアウト
          </button>
        </div>

      </div>
    </main>
  )
}