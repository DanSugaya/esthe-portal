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
    <main className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border shadow-sm">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {isSignUp ? '新規会員登録' : 'ログイン'}
      </h1>

      {errorMsg && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 text-sm text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="6文字以上のパスワード"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? '処理中...' : isSignUp ? '登録する' : 'ログイン'}
        </button>
      </form>

      <div className="mt-6 text-center border-t pt-4">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            setErrorMsg(null)
            setSuccessMsg(null)
          }}
          className="text-sm text-emerald-600 hover:underline"
        >
          {isSignUp
            ? 'すでにアカウントをお持ちの方（ログイン）'
            : 'アカウントをお持ちでない方（新規登録）'}
        </button>
      </div>
    </main>
  )
}