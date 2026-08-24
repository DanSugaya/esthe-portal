'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Menu {
  id: string
  name: string
}

interface ReviewFormProps {
  salonId: string
  menus: Menu[]
}

export default function ReviewForm({ salonId, menus }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5)
  const [menuId, setMenuId] = useState<string>('')
  const [therapistName, setTherapistName] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setErrorMsg('口コミを投稿するにはログインが必要です。')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('reviews').insert({
      salon_id: salonId,
      user_id: user.id,
      menu_id: menuId || null,
      therapist_name: therapistName || null,
      rating,
      comment,
    })

    if (error) {
      setErrorMsg('投稿に失敗しました: ' + error.message)
      setLoading(false)
      return
    }

    // フォームクリアと画面再読み込み
    setComment('')
    setTherapistName('')
    setMenuId('')
    setRating(5)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-xl p-5 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">口コミを投稿する</h3>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {errorMsg}
        </div>
      )}

      {/* 評価（星1-5） */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          評価 (1 〜 5)
        </label>
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`text-2xl transition ${
                num <= rating ? 'text-amber-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
          <span className="text-sm font-bold text-gray-600 ml-2">{rating} 点</span>
        </div>
      </div>

      {/* コース（メニュー）選択 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          利用したコース（任意）
        </label>
        <select
          value={menuId}
          onChange={(e) => setMenuId(e.target.value)}
          className="w-full border rounded-lg p-2.5 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">コースを選択してください</option>
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name}
            </option>
          ))}
        </select>
      </div>

      {/* 担当セラピスト */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          担当セラピスト名（任意）
        </label>
        <input
          type="text"
          value={therapistName}
          onChange={(e) => setTherapistName(e.target.value)}
          placeholder="例: 山田さん"
          className="w-full border rounded-lg p-2.5 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* コメント */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          口コミコメント <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="施術の感想や雰囲気などを教えてください"
          className="w-full border rounded-lg p-2.5 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-50"
      >
        {loading ? '送信中...' : '口コミを投稿する'}
      </button>
    </form>
  )
}