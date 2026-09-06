'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { LayoutDashboard, Image as ImageIcon, Store, ShieldCheck, ChevronRight, Lock } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  useEffect(() => {
    const checkAdminAuth = async () => {
      // 1. ログインユーザー情報の取得
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      // 2. admin 権限のチェック (profiles テーブルの role カラムを想定)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        alert('管理者権限が必要です。')
        router.push('/')
        return
      }

      setLoading(false)
    }

    checkAdminAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-zinc-400 text-sm font-medium">
        <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3" />
        <span className="text-zinc-400 animate-pulse">管理者権限を確認中...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ヘッダー */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-pink-500" />
                管理者ダッシュボード
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                システム全体の管理および設定メニューを選択してください
              </p>
            </div>
          </div>
        </div>

        {/* 分岐カードリスト */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. バナー管理 */}
          <Link
            href="/admin/banners"
            className="group p-6 border border-zinc-800/90 rounded-2xl bg-zinc-900/90 shadow-lg hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/30 rounded-xl flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white group-hover:text-pink-400 transition-colors">
                  バナー管理
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  トップページや各エリアの宣伝バナー画像の追加・削除・並び替えを行います。
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-pink-500 group-hover:translate-x-1 transition-transform">
              管理画面を開く <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* 2. サロン承認 (pending) */}
          <Link
            href="/admin/pending"
            className="group p-6 border border-zinc-800/90 rounded-2xl bg-zinc-900/90 shadow-lg hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/30 rounded-xl flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white group-hover:text-pink-400 transition-colors">
                  サロン承認
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  店舗オーナーから申請された新規店舗の審査および掲載許可（承認）を行います。
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-pink-500 group-hover:translate-x-1 transition-transform">
              承認待ち一覧を開く <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

          {/* 3. 店舗情報修正 */}
          <Link
            href="/admin/salons"
            className="group p-6 border border-zinc-800/90 rounded-2xl bg-zinc-900/90 shadow-lg hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-200 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/30 rounded-xl flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white group-hover:text-pink-400 transition-colors">
                  店舗情報修正
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  登録済みサロン全件の検索、掲載内容の直接編集および公開ステータスの変更を行います。
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-pink-500 group-hover:translate-x-1 transition-transform">
              店舗一覧を開く <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </Link>

        </div>

      </div>
    </main>
  )
}