'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
  type: 'main' | 'sub';
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [type, setType] = useState<'main' | 'sub'>('main');

  const supabase = createClient();

  const loadBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('type', { ascending: true })
      .order('sort_order', { ascending: true });
    if (data) setBanners(data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // 新規追加
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('banners').insert([
      {
        title,
        image_url: imageUrl,
        link_url: linkUrl,
        sort_order: sortOrder,
        type,
        is_active: true,
      },
    ]);

    if (!error) {
      setTitle('');
      setImageUrl('');
      setLinkUrl('');
      setSortOrder(1);
      loadBanners();
    } else {
      alert('登録に失敗しました: ' + error.message);
    }
  };

  // 表示/非表示切り替え
  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('banners')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    loadBanners();
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    await supabase.from('banners').delete().eq('id', id);
    loadBanners();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 text-slate-100">
      {/* ページタイトル */}
      <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#e6007e] rounded-full shadow-[0_0_8px_rgba(230,0,126,0.8)]" />
        バナー管理
      </h1>

      {/* 登録フォーム */}
      <form onSubmit={handleAdd} className="p-5 border border-neutral-800 rounded-2xl bg-neutral-900 shadow-xl space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          新規バナー登録
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">バナー種別</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200 hover:text-[#ff2a9d] transition-colors">
              <input
                type="radio"
                name="type"
                value="main"
                checked={type === 'main'}
                onChange={() => setType('main')}
                className="accent-[#e6007e]"
              />
              メインバナー (ローテーション)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200 hover:text-[#ff2a9d] transition-colors">
              <input
                type="radio"
                name="type"
                value="sub"
                checked={type === 'sub'}
                onChange={() => setType('sub')}
                className="accent-[#e6007e]"
              />
              サブバナー (スクエア横スクロール)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">タイトル（管理用）</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
              placeholder="例: 春のキャンペーン"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">表示順</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">画像URL</label>
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">遷移先URL</label>
          <input
            type="url"
            required
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#e6007e] focus:ring-1 focus:ring-[#e6007e] transition-all"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[#e6007e] to-[#ff2a9d] hover:from-[#d00070] hover:to-[#e6007e] text-white font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(230,0,126,0.4)] active:scale-95 transition-all"
        >
          バナーを追加する
        </button>
      </form>

      {/* 一覧表示 */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          登録済みバナー一覧
        </h2>
        <div className="space-y-2">
          {banners.map((b) => (
            <div
              key={b.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border border-neutral-800 p-3 rounded-xl bg-neutral-900 shadow-md gap-3 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={b.image_url}
                  alt={b.title}
                  className={`object-cover rounded-lg border border-neutral-800 shrink-0 ${
                    b.type === 'main' ? 'w-24 h-12' : 'w-12 h-12'
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        b.type === 'main'
                          ? 'bg-[#e6007e]/20 text-[#ff2a9d] border border-[#e6007e]/40'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                      }`}
                    >
                      {b.type === 'main' ? 'メイン' : 'サブ'}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{b.title}</span>
                    <span className="text-[10px] text-neutral-500">順序: {b.sort_order}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate max-w-xs md:max-w-md">{b.link_url}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => toggleActive(b.id, b.is_active)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    b.is_active
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-800/80'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                  }`}
                >
                  {b.is_active ? '表示中' : '非表示'}
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-pink-950/60 text-pink-300 border border-pink-800/60 hover:bg-pink-900/80 transition-all"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}