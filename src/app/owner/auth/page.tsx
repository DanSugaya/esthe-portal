'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OwnerAuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
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
      if (isLogin) {
        // 1. ログイン処理
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError) throw new Error(authError.message)

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
      } else {
        // 新規掲載申請ページへリダイレクト
        router.push('/owner/register')
      }
    } catch (err: any) {
      alert(err.message || '認証エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow-sm border space-y-4">
        
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-800">
            {isLogin ? '店舗オーナー ログイン' : '店舗掲載のお申し込み'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin ? '管理画面へアクセスします' : '新規掲載申請フォームへ進みます'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">メールアドレス</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-slate-300 p-2 text-xs outline-none focus:ring-1 focus:ring-slate-800"
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
              className="w-full rounded border border-slate-300 p-2 text-xs outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? '処理中...' : isLogin ? 'ログイン' : '申請フォームへ進む'}
          </button>
        </form>

        <div className="pt-2 border-t text-center space-y-2">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-600 hover:underline"
          >
            {isLogin ? '新規掲載申請はこちら' : 'すでにアカウントをお持ちの方（ログイン）'}
          </button>

          <div>
            <Link href="/" className="text-xs text-slate-400 hover:underline">
              トップページに戻る
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}