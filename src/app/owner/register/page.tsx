'use client'

import { useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// エリアマスタデータの定義
const AREA_OPTIONS = [
  { id: 9, name: '大宮' },
  { id: 10, name: '浦和' },
  { id: 11, name: '川口・西川口・蕨' },
  { id: 12, name: '越谷・草加・春日部' },
  { id: 13, name: '川越・坂戸' },
  { id: 14, name: '志木・朝霞台・和光' },
  { id: 15, name: '所沢' },
  { id: 16, name: '久喜・蓮田' },
  { id: 17, name: '上尾・鴻巣' },
  { id: 18, name: '熊谷・本庄' },
]

export default function OwnerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  // SupabaseクライアントをMemo化して再生成を防止
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  const [formData, setFormData] = useState({
    // アカウント情報
    email: '',
    password: '',
    // 店舗情報 (salonsDB仕様)
    categoryId: '1', // デフォルト: 店舗型(1)
    name: '',
    chechphrase: '',
    imageUrl: '',
    useLocationId: '9', // デフォルト: 大宮(9)
    priceInfo: '',
    cardOk: false,
    businessHours: '',
    receptionHours: '',
    phone: '',
    access: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // HTMLのrequired属性でチェックされるため、JSでの必須チェックはカット

    if (!agreed) {
      alert('利用規約をご確認の上、同意にチェックを入れてください。')
      return
    }

    setLoading(true)

    try {
      // 1. 店舗オーナーのアカウント作成
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'owner',
            salon_name: formData.name,
          },
        },
      })

      if (authError) throw new Error(`アカウント作成エラー: ${authError.message}`)

      const user = authData.user
      if (!user) {
        throw new Error('ユーザーアカウントの生成に失敗しました。')
      }

      // 2. salons テーブルへデータ挿入 (DBカラム名に完全準拠)
      const { error: salonError } = await supabase.from('salons').insert([
        {
          category_id: Number(formData.categoryId),
          name: formData.name,
          chechphrase: formData.chechphrase,
          image_url: formData.imageUrl,
          is_published: false, // 初期値は非公開（審査待ち）
          use_location_id: Number(formData.useLocationId),
          price_info: formData.priceInfo,
          card_ok: formData.cardOk,
          business_hours: formData.businessHours,
          reception_hours: formData.receptionHours,
          phone: formData.phone,
          access: formData.access,
        },
      ])

      if (salonError) throw new Error(`店舗登録エラー: ${salonError.message}`)

      alert('掲載申請が完了しました。審査完了までお待ちください。')
      router.push('/owner/pending')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err)
        alert(err.message || '送信中にエラーが発生しました。')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 py-10 px-4 sm:px-6 text-zinc-100">
      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
        
        <div className="bg-zinc-950 border-b border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold bg-pink-950/80 border border-pink-500/30 text-pink-400 px-3 py-1 rounded-full">
              店舗向け
            </span>
            <Link href="/owner/auth" className="text-xs text-zinc-400 hover:text-pink-400 transition">
              すでに登録済みの方（ログイン）
            </Link>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">新規掲載申請</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. アカウント情報 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-pink-400 border-b pb-1 border-zinc-800 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-pink-500 rounded-full inline-block" />
              1. ログインアカウント設定
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="owner@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  パスワード
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="8文字以上"
                />
              </div>
            </div>
          </div>

          {/* 2. 店舗基本情報 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-pink-400 border-b pb-1 border-zinc-800 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-pink-500 rounded-full inline-block" />
              2. 掲載店舗情報
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  カテゴリ
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="1">店舗型</option>
                  <option value="2">マンション型</option>
                  <option value="3">派遣型</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  対象エリア
                </label>
                <select
                  required
                  value={formData.useLocationId}
                  onChange={(e) => setFormData({ ...formData, useLocationId: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {AREA_OPTIONS.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                店舗名
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="サロン名を入力"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                キャッチコピー
              </label>
              <input
                type="text"
                required
                value={formData.chechphrase}
                onChange={(e) => setFormData({ ...formData, chechphrase: e.target.value })}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="極上のリラクゼーション空間をお届けします"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                画像URL
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {/* 3. 営業・料金情報 */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-pink-400 border-b pb-1 border-zinc-800 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-pink-500 rounded-full inline-block" />
              3. 営業・料金情報
            </h2>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                料金目安
              </label>
              <input
                type="text"
                required
                value={formData.priceInfo}
                onChange={(e) => setFormData({ ...formData, priceInfo: e.target.value })}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="例: 90分 / ￥18,000"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  営業時間
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="10:00 - 23:00"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  受付時間
                </label>
                <input
                  type="text"
                  required
                  value={formData.receptionHours}
                  onChange={(e) => setFormData({ ...formData, receptionHours: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="09:30 - 22:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  電話番号
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="03-1234-5678"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.cardOk}
                    onChange={(e) => setFormData({ ...formData, cardOk: e.target.checked })}
                    className="rounded text-pink-600 bg-zinc-950 border-zinc-700 w-4 h-4 cursor-pointer focus:ring-pink-500"
                  />
                  クレジットカード利用可
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                アクセス
              </label>
              <textarea
                rows={2}
                required
                value={formData.access}
                onChange={(e) => setFormData({ ...formData, access: e.target.value })}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="〇〇駅徒歩3分"
              />
            </div>
          </div>

          {/* 利用規約同意 */}
          <div className="space-y-3">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
              規約をご確認ください。申請完了後、運営事務局の審査を経て正式に掲載されます。
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded text-pink-600 bg-zinc-950 border-zinc-700 w-4 h-4 cursor-pointer focus:ring-pink-500"
              />
              利用規約に同意する
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg text-sm transition shadow-lg shadow-pink-950/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? '申請送信中...' : '掲載申請を送信する'}
          </button>
        </form>
      </div>
    </main>
  )
}