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
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw new Error(authError.message)

      const userRole = authData.user?.user_metadata?.role
      if (userRole !== 'owner') {
        await supabase.auth.signOut()
        throw new Error('店舗オーナー用のアカウントではありません。')
      }

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
    <div className="min-h-screen bg-[#b29146] text-slate-800 font-sans pb-16">
      
      {/* 1. アナウンスバー（最上部バナー） */}
      <div className="bg-[#4a3910] text-[#f2e6c9] text-[11px] py-2 px-4 text-center font-bold">
        【特別企画】現在、新規掲載店舗様を無料募集・全有料プラン解放中！
      </div>

      {/* 2. メインヒーローセクション */}
      <section className="px-4 pt-8 pb-6 text-center text-[#fffde8]">
        <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-white drop-shadow">
          埼玉メンズエステ情報館<br />
          店舗パートナー募集プログラム
        </h1>
        <p className="text-xs leading-relaxed max-w-xs mx-auto opacity-90">
          データ駆動型の集客で、<br />
          あなたのお店の予約数を最大化します。
        </p>

        {/* 中央のグラフィックアイコン風カード */}
        <div className="my-6 mx-auto w-48 h-48 bg-[#fffde8] rounded-full flex flex-col items-center justify-center p-4 shadow-inner border-4 border-[#8c7031] text-[#735920]">
          <div className="text-3xl mb-1">🏪</div>
          <span className="text-xs font-extrabold tracking-wider">掲載手数料</span>
          <span className="text-xl font-black text-[#c0392b]">初期・月額 0円</span>
          <span className="text-[10px] bg-[#735920] text-white px-2 py-0.5 rounded-full mt-1">先行受付中</span>
        </div>

        <p className="text-xs font-bold text-[#fffde8]">
          掲載開始までのステップ＆ログイン方法
        </p>
      </section>

      {/* 3. ナビゲーションアイコン（紹介する方 / 登録する方） */}
      <section className="max-w-sm mx-auto px-4 mb-6 flex justify-center gap-6">
        <a href="#register-step" className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#fffde8] flex items-center justify-center text-xl shadow border-2 border-[#8c7031] text-[#8c7031]">
            📝
          </div>
          <span className="text-xs font-bold text-white mt-1">新規掲載</span>
        </a>
        <a href="#login-form" className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#fffde8] flex items-center justify-center text-xl shadow border-2 border-[#8c7031] text-[#8c7031]">
            🔑
          </div>
          <span className="text-xs font-bold text-white mt-1">ログイン</span>
        </a>
      </section>

      {/* 4. メインコンテンツカード（新規登録・掲載の流れ） */}
      <section id="register-step" className="max-w-sm mx-auto px-4 mb-8">
        <div className="bg-[#fffde8] rounded-2xl p-5 shadow-lg border border-[#d9c593]">
          
          {/* カードヘッダー */}
          <div className="bg-[#2c80a4] text-white text-center py-2 rounded-xl mb-4 shadow-sm">
            <h2 className="font-bold text-sm">新規掲載申請の流れ</h2>
            <p className="text-[10px] opacity-90">埼玉エリアの店舗様限定特典</p>
          </div>

          <div className="bg-[#e6f4f8] p-3 rounded-lg text-center text-[#1f5a73] font-bold text-xs mb-6">
            今なら全有料プラン機能<br />
            アクセス解析を無料提供！
          </div>

          {/* ステップ 01 */}
          <div className="mb-6 relative pl-10 border-l-2 border-dashed border-[#2c80a4]">
            <span className="absolute -left-3 top-0 text-[#2c80a4] font-black text-xl bg-[#fffde8] px-1">
              01
            </span>
            <h3 className="font-bold text-xs text-[#2c80a4] mb-1">無料アカウント登録</h3>
            <p className="text-[11px] text-slate-600 leading-snug mb-3">
              以下のフォームより、メールアドレスとパスワードを入力して掲載申請を行います。
            </p>
            <Link
              href="/owner/register"
              className="block w-full text-center py-2.5 bg-[#c0392b] text-white rounded-full font-bold text-xs shadow-md hover:opacity-90 transition"
            >
              新規掲載申請はこちら ›
            </Link>
          </div>

          {/* ステップ 02 */}
          <div className="mb-6 relative pl-10 border-l-2 border-dashed border-[#2c80a4]">
            <span className="absolute -left-3 top-0 text-[#2c80a4] font-black text-xl bg-[#fffde8] px-1">
              02
            </span>
            <h3 className="font-bold text-xs text-[#2c80a4] mb-1">店舗情報の登録・審査</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              管理画面より店舗名、写真、コース情報を登録。運営側で迅速に確認・承認処理を行います。
            </p>
          </div>

          {/* ステップ 03 */}
          <div className="relative pl-10">
            <span className="absolute -left-3 top-0 text-[#2c80a4] font-black text-xl bg-[#fffde8] px-1">
              03
            </span>
            <h3 className="font-bold text-xs text-[#2c80a4] mb-1">掲載開始＆アクセス分析</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              ポータルサイトに即時反映。ダッシュボードでPV数やユーザーの行動をリアルタイムで追跡可能です。
            </p>
          </div>

        </div>
      </section>

      {/* 5. オーナーログインフォーム */}
      <section id="login-form" className="max-w-sm mx-auto px-4 mb-8">
        <div className="bg-[#fffde8] rounded-2xl p-5 shadow-lg border border-[#d9c593]">
          
          <div className="bg-[#2d7350] text-white text-center py-2 rounded-xl mb-4 shadow-sm">
            <h2 className="font-bold text-sm">店舗オーナー ログイン</h2>
            <p className="text-[10px] opacity-90">登録がお済みの方はこちら</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">メールアドレス</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none focus:ring-2 focus:ring-[#2d7350]"
                placeholder="owner@example.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">パスワード</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none focus:ring-2 focus:ring-[#2d7350]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2d7350] text-white rounded-full text-xs font-bold shadow-md hover:opacity-90 transition cursor-pointer"
            >
              {loading ? 'ログイン中...' : '管理画面にログインする'}
            </button>
          </form>

        </div>
      </section>

      {/* 6. 注意事項・特記事項（アコーディオン風デザイン） */}
      <section className="max-w-sm mx-auto px-4 mb-8 text-[#fffde8]">
        <div className="border-t border-[#d9c593]/40 pt-4">
          <h3 className="font-bold text-xs text-center mb-3 text-[#fffde8]">掲載に関する注意事項</h3>
          <ul className="text-[10px] space-y-1.5 opacity-90 list-disc list-inside leading-relaxed">
            <li>埼玉エリア内のメンズエステ店舗様のみご登録いただけます。</li>
            <li>風営法および関係法令を遵守している店舗に限ります。</li>
            <li>無料枠の適用期間・特典内容は予告なく変更となる場合があります。</li>
            <li>申請内容に不備がある場合、審査にお時間をいただくことがございます。</li>
          </ul>
        </div>
      </section>

      {/* 7. フッターナビゲーション */}
      <footer className="max-w-sm mx-auto px-4 pt-6 border-t border-[#4a3910] text-[#f2e6c9] text-center text-[10px]">
        <div className="space-y-2 mb-4">
          <div><Link href="/" className="hover:underline">トップページに戻る</Link></div>
          <div><Link href="/terms" className="hover:underline">利用規約</Link> | <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link></div>
        </div>
      </footer>

    </div>
  )
}