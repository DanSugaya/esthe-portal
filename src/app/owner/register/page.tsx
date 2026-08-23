'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OwnerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [formData, setFormData] = useState({
    // アカウント情報
    email: '',
    password: '',
    // 店舗情報 (salons)
    salonName: '',
    description: '',
    imageUrl: '',
    // 初回メニュー情報 (menus)
    menuTitle: '',
    menuDuration: '60',
    menuPrice: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      alert('利用規約をご確認の上、同意にチェックを入れてください。')
      return
    }

    setLoading(true)

    try {
      // 1. 店舗オーナーのアカウント作成
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'owner',
            salon_name: formData.salonName,
          },
        },
      })

      if (authError) throw new Error(`アカウント作成エラー: ${authError.message}`)

      // 2. セッションを確実に確立するため明示的にログインを実行
      const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (loginError || !sessionData.user) {
        throw new Error('ログインセッションの取得に失敗しました。')
      }

      const userId = sessionData.user.id

      // 3. salons テーブルへデータ挿入 (statusは初期値pending、owner_idを紐付け)
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .insert([
          {
            owner_id: userId,
            name: formData.salonName,
            description: formData.description,
            image_url: formData.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (salonError) throw new Error(`店舗登録エラー: ${salonError.message}`)

      // 4. menus テーブルへ初期メニュー挿入
      if (formData.menuTitle && salonData) {
        const { error: menuError } = await supabase.from('menus').insert([
          {
            salon_id: salonData.id,
            title: formData.menuTitle,
            duration: Number(formData.menuDuration) || 60,
            price: Number(formData.menuPrice) || 0,
          },
        ])

        if (menuError) throw new Error(`メニュー登録エラー: ${menuError.message}`)
      }

      alert('掲載申請が完了しました。審査完了までお待ちください。')
      router.push('/owner/pending')
    } catch (err: any) {
      console.error(err)
      alert(err.message || '送信中にエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="bg-slate-900 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold bg-emerald-500 text-white px-3 py-1 rounded-full">
              店舗向け
            </span>
            <Link href="/owner/auth" className="text-xs text-slate-400 hover:text-white">
              すでに登録済みの方（ログイン）
            </Link>
          </div>
          <h1 className="text-xl font-bold">新規掲載申請</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. アカウント情報 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-1 border-slate-200">
              1. ログインアカウント設定
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">メールアドレス *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="owner@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">パスワード *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="8文字以上"
                />
              </div>
            </div>
          </div>

          {/* 2. salons 情報 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-1 border-slate-200">
              2. 掲載店舗情報
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">店舗名 *</label>
              <input
                type="text"
                required
                value={formData.salonName}
                onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="サロン・ド・ボーテ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">画像URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">店舗紹介文</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 3. menus 情報 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-1 border-slate-200">
              3. 初期メニュー情報
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">メニュー名 *</label>
              <input
                type="text"
                required
                value={formData.menuTitle}
                onChange={(e) => setFormData({ ...formData, menuTitle: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="例: フェイシャル基本コース"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">施術時間 (分) *</label>
                <input
                  type="number"
                  required
                  value={formData.menuDuration}
                  onChange={(e) => setFormData({ ...formData, menuDuration: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">価格 (円) *</label>
                <input
                  type="number"
                  required
                  value={formData.menuPrice}
                  onChange={(e) => setFormData({ ...formData, menuPrice: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="8000"
                />
              </div>
            </div>
          </div>

          {/* 利用規約同意 */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
              規約をご確認ください。申請完了後、運営事務局の審査を経て正式に掲載されます。
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
              />
              利用規約に同意する
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? '申請送信中...' : '掲載申請を送信する'}
          </button>
        </form>
      </div>
    </main>
  )
}