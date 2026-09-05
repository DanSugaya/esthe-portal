'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Supabaseでログイン
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 2. profiles テーブルから role を取得してチェック
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        throw new Error(`プロフィール情報の取得に失敗しました: ${profileError.message}`)
      }

      if (profile?.role !== 'admin') {
        // 管理者でない場合はログアウトさせて弾く
        await supabase.auth.signOut()
        alert('管理者権限がありません。')
        return
      }

      // 3. 管理者画面へ遷移
      router.push('/admin/salons')
    } catch (err: any) {
      alert(`ログインエラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 text-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <div>
          <span className="text-[10px] font-extrabold text-[#ff2a9d] bg-[#e6007e]/15 border border-[#e6007e]/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
            運営専用
          </span>
          <h1 className="text-xl font-black text-white mt-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#e6007e] rounded-full shadow-[0_0_8px_rgba(230,0,126,0.8)]" />
            システム管理者ログイン
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              管理者メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#e6007e] to-[#ff2a9d] hover:from-[#d00070] hover:to-[#e6007e] text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(230,0,126,0.4)] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? '認証中...' : '管理者としてログイン'}
        </button>
      </form>
    </main>
  )
}