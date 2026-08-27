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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">バナー管理</h1>

      {/* 登録フォーム */}
      <form onSubmit={handleAdd} className="p-4 border rounded-lg bg-gray-50 space-y-4">
        <h2 className="text-lg font-semibold">新規バナー登録</h2>

        <div>
          <label className="block text-sm font-medium mb-1">バナー種別</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="main"
                checked={type === 'main'}
                onChange={() => setType('main')}
              />
              メインバナー (ローテーション)
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="sub"
                checked={type === 'sub'}
                onChange={() => setType('sub')}
              />
              サブバナー (スクエア横スクロール)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">タイトル（管理用）</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="例: 春のキャンペーン"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">表示順</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">画像URL</label>
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">遷移先URL</label>
          <input
            type="url"
            required
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
        >
          バナーを追加する
        </button>
      </form>

      {/* 一覧表示 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">登録済みバナー一覧</h2>
        <div className="space-y-2">
          {banners.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={b.image_url}
                  alt={b.title}
                  className={`object-cover rounded border ${
                    b.type === 'main' ? 'w-24 h-10' : 'w-12 h-12'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded text-white font-bold ${
                        b.type === 'main' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    >
                      {b.type === 'main' ? 'メイン' : 'サブ'}
                    </span>
                    <span className="font-bold">{b.title}</span>
                    <span className="text-xs text-gray-400">順序: {b.sort_order}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate max-w-md">{b.link_url}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(b.id, b.is_active)}
                  className={`px-3 py-1 text-xs rounded text-white ${
                    b.is_active ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                >
                  {b.is_active ? '表示中' : '非表示'}
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-3 py-1 text-xs rounded bg-red-600 text-white"
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