'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PlusCircle, Image as ImageIcon, ExternalLink, ArrowUpDown, Trash2, Eye, EyeOff, LayoutGrid } from 'lucide-react'

type Banner = {
  id: string
  title: string
  image_url: string
  link_url: string
  sort_order: number
  is_active: boolean
  type: 'main' | 'sub'
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [sortOrder, setSortOrder] = useState(1)
  const [type, setType] = useState<'main' | 'sub'>('main')
  const [submitting, setSubmitting] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const loadBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('type', { ascending: true })
      .order('sort_order', { ascending: true })
    if (data) setBanners(data)
  }

  useEffect(() => {
    loadBanners()
  }, [])

  // 新規追加
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('banners').insert([
      {
        title,
        image_url: imageUrl,
        link_url: linkUrl,
        sort_order: sortOrder,
        type,
        is_active: true,
      },
    ])

    if (!error) {
      setTitle('')
      setImageUrl('')
      setLinkUrl('')
      setSortOrder(1)
      loadBanners()
    } else {
      alert('登録に失敗しました: ' + error.message)
    }
    setSubmitting(false)
  }

  // 表示/非表示切り替え
  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('banners')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    loadBanners()
  }

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return
    await supabase.from('banners').delete().eq('id', id)
    loadBanners()
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダーエリア */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                バナー設定・管理
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                トップページに表示するメイン/サブバナーの登録・並び替え・表示切り替えを行います
              </p>
            </div>
          </div>
        </div>

        {/* 登録フォーム */}
        <form
          onSubmit={handleAdd}
          className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/90 shadow-xl space-y-6"
        >
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <PlusCircle className="w-5 h-5 text-pink-500" />
            新規バナー登録
          </h2>

          {/* バナー種別 */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">バナー種別</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'main'
                    ? 'bg-pink-950/30 border-pink-500/60 text-white shadow-[0_0_12px_rgba(236,72,153,0.15)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="main"
                  checked={type === 'main'}
                  onChange={() => setType('main')}
                  className="accent-pink-500"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-100">メインバナー</div>
                  <div className="text-[10px] text-zinc-400">ヒーローエリアのローテーション表示</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'sub'
                    ? 'bg-pink-950/30 border-pink-500/60 text-white shadow-[0_0_12px_rgba(236,72,153,0.15)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="sub"
                  checked={type === 'sub'}
                  onChange={() => setType('sub')}
                  className="accent-pink-500"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-100">サブバナー</div>
                  <div className="text-[10px] text-zinc-400">スクエア型の横スクロール表示</div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">タイトル（管理用）</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                placeholder="例: 春の特別限定キャンペーン"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                表示順
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              画像URL
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              遷移先URL
            </label>
            <input
              type="url"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-950/60 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {submitting ? '追加中...' : 'バナーを追加する'}
          </button>
        </form>

        {/* 一覧表示 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-pink-500" />
              登録済みバナー一覧
            </h2>
            <span className="text-xs text-zinc-400">
              全 <span className="text-pink-400 font-bold">{banners.length}</span> 件
            </span>
          </div>

          {banners.length === 0 ? (
            <div className="p-8 border border-zinc-800/80 rounded-2xl bg-zinc-900/40 text-center text-zinc-500 text-xs">
              登録されているバナーはありません。
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="p-4 border border-zinc-800/90 rounded-2xl bg-zinc-900/90 shadow-lg hover:border-pink-500/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <img
                        src={b.image_url}
                        alt={b.title}
                        className={`object-cover ${
                          b.type === 'main' ? 'w-28 h-14' : 'w-14 h-14'
                        }`}
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            b.type === 'main'
                              ? 'bg-pink-950/60 text-pink-400 border-pink-800/50'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          {b.type === 'main' ? 'メイン' : 'サブ'}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors truncate">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          順序: {b.sort_order}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span className="truncate">{b.link_url}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => toggleActive(b.id, b.is_active)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
                        b.is_active
                          ? 'bg-pink-950/50 text-pink-300 border-pink-700/60 hover:bg-pink-900/60 shadow-[0_0_8px_rgba(236,72,153,0.2)]'
                          : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                      }`}
                    >
                      {b.is_active ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-pink-400" />
                          表示中
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                          非表示
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 text-xs font-bold rounded-xl bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-red-900/80 hover:bg-red-950/30 hover:text-red-400 transition-all cursor-pointer"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}