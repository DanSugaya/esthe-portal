'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    if (isSignUp) {
      // 新規登録処理
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('確認メールを送信しました。メール内のリンクをクリックしてください。')
      }
    } else {
      // ログイン処理
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg('メールアドレスまたはパスワードが正しくありません。')
      } else {
        router.push('/')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <main className="max-w-md mx-auto my-8 px-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* 上部の背景装飾アクセント */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#e6007e]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#e6007e]/10 rounded-full blur-2xl pointer-events-none" />

        {/* タイトル */}
        <h1 className="text-xl font-black text-center text-white mb-6 tracking-wide flex items-center justify-center gap-2">
          <span className="w-1.5 h-4 bg-[#e6007e] rounded-full shadow-[0_0_8px_rgba(230,0,126,0.8)]" />
          {isSignUp ? '新規会員登録' : 'ログイン'}
        </h1>

        {/* エラーメッセージ */}
        {errorMsg && (
          <div className="mb-5 p-3 text-xs text-pink-300 bg-pink-950/60 rounded-xl border border-pink-800/60 leading-relaxed shadow-[0_0_10px_rgba(230,0,126,0.15)]">
            {errorMsg}
          </div>
        )}

        {/* 成功メッセージ */}
        {successMsg && (
          <div className="mb-5 p-3 text-xs text-emerald-300 bg-emerald-950/60 rounded-xl border border-emerald-800/60 leading-relaxed shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
              placeholder="6文字以上のパスワード"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#e6007e] to-[#ff2a9d] hover:from-[#d00070] hover:to-[#e6007e] text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(230,0,126,0.4)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '処理中...' : isSignUp ? '登録する' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-neutral-800/80 pt-4 relative z-10">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMsg(null)
              setSuccessMsg(null)
            }}
            className="text-xs text-[#ff2a9d] hover:text-[#ff66b8] font-semibold transition-colors"
          >
            {isSignUp
              ? 'すでにアカウントをお持ちの方（ログイン）'
              : 'アカウントをお持ちでない方（新規登録）'}
          </button>
        </div>
      </div>
    </main>
  )
}