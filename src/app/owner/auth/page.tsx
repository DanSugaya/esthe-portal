'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OwnerAuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. ログイン処理
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw new Error(authError.message)

      // ロールの確認（owner 以外を弾く）
      const userRole = authData.user?.user_metadata?.role
      if (userRole !== 'owner') {
        await supabase.auth.signOut()
        throw new Error('店舗オーナー用のアカウントではありません。')
      }

      // 2. 店舗のステータスを取得して振り分け
      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .select('status')
        .eq('owner_id', authData.user.id)
        .single()

      if (salonError || !salon || salon.status === 'pending') {
        router.push('/owner/pending')
      } else if (salon.status === 'approved') {
        router.push('/owner/dashboard')
      } else {
        alert('アカウントの状態を確認できません。運営にお問い合わせください。')
      }
    } catch (err: any) {
      alert(err.message || '認証エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-pink-900/20 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-4">
            店舗オーナー様向けポータル
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            集客からマーケティング分析まで。<br className="hidden sm:block" />
            次世代の店舗管理プラットフォーム。
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8">
            アクセス解析、顧客動向把握、売上最大化の施策立案までをワンストップでサポート。
          </p>

          {/* キャンペーンバナー */}
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-amber-500/30 rounded-2xl p-4 text-left sm:flex items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                現在オープン記念
              </span>
              <h3 className="text-sm font-bold text-amber-200">プレミアムプラン（有料機能）全開放中！</h3>
              <p className="text-xs text-slate-300 mt-0.5">初期費用・月額利用料ともに完全無料で掲載いただけます。</p>
            </div>
            <a
              href="#login-form"
              className="mt-3 sm:mt-0 inline-block text-center whitespace-nowrap bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition"
            >
              無料掲載に申し込む
            </a>
          </div>
        </div>
      </section>

      {/* メインコンテンツ（LP説明 + ログイン/登録フォーム） */}
      <section id="login-form" className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* 左側：機能・魅力のビジュアル紹介（グラフィカルなLP要素） */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">なぜ今、掲載すべきなのか？</h2>
            <p className="text-xs text-slate-400">データに基づいた店舗運営（OODAループ）を実現する高度な機能を順次提供。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 機能カード 1 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-3 text-sm font-bold">
                01
              </div>
              <h3 className="text-sm font-bold text-white mb-1">グラフィカルなアクセス解析</h3>
              <p className="text-xs text-slate-400">
                PV数やクリック率、時間帯別のPV推移をダッシュボードで一目で把握。
              </p>
            </div>

            {/* 機能カード 2 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400 mb-3 text-sm font-bold">
                02
              </div>
              <h3 className="text-sm font-bold text-white mb-1">OODAに基づく改善アクション</h3>
              <p className="text-xs text-slate-400">
                観察・状況判断から迅速に次の一手（クーポン発刊や写真変更）を実行。
              </p>
            </div>

            {/* 機能カード 3 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-3 text-sm font-bold">
                03
              </div>
              <h3 className="text-sm font-bold text-white mb-1">全有料プラン機能を無料提供</h3>
              <p className="text-xs text-slate-400">
                掲載初期の認知拡大をサポートするため、限定枠でプレミアム機能を初期完全解放。
              </p>
            </div>

            {/* 機能カード 4 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 mb-3 text-sm font-bold">
                04
              </div>
              <h3 className="text-sm font-bold text-white mb-1">簡単操作の管理画面</h3>
              <p className="text-xs text-slate-400">
                スマホからでも簡単に店舗情報の更新や写真の差し替えが可能。
              </p>
            </div>
          </div>

          {/* 今後実装予定のダッシュボードプレビュー領域 */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300">ダッシュボード機能プレビュー</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                開発予定・順次公開
              </span>
            </div>
            
            {/* プレビューイメージ（CSSによるダミーグラフ表示） */}
            <div className="space-y-3 opacity-80">
              <div className="h-16 bg-slate-900/80 rounded border border-slate-700/50 p-2 flex items-end justify-between gap-1">
                <div className="w-full bg-indigo-500/40 rounded-t h-4 animate-pulse" />
                <div className="w-full bg-indigo-500/60 rounded-t h-8 animate-pulse" />
                <div className="w-full bg-indigo-500/80 rounded-t h-12 animate-pulse" />
                <div className="w-full bg-indigo-500 rounded-t h-10 animate-pulse" />
                <div className="w-full bg-indigo-500/50 rounded-t h-6 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-slate-900/80 rounded border border-slate-700/50" />
                <div className="flex-1 h-8 bg-slate-900/80 rounded border border-slate-700/50" />
              </div>
            </div>
          </div>
        </div>

        {/* 右側：ログイン & 申請フォーム */}
        <div className="lg:col-span-5 w-full bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">オーナーログイン</h2>
            <p className="text-xs text-slate-500 mt-1">掲載中の店舗オーナー様はこちら</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">メールアドレス</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:ring-2 focus:ring-slate-900 transition"
                placeholder="owner@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">パスワード</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:ring-2 focus:ring-slate-900 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? '認証中...' : '管理画面にログイン'}
            </button>
          </form>

          {/* 新規掲載申請への誘導 */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-200">
              <p className="text-xs text-slate-600 mb-2 font-medium">まだアカウントをお持ちでない方</p>
              <Link
                href="/owner/register"
                className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition shadow-sm"
              >
                無料掲載申請（新規登録）を行う
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 hover:underline transition">
                ← トップページに戻る
              </Link>
            </div>
          </div>

        </div>

      </section>
    </div>
  )
}