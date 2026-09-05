'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type NewsItem = {
  id: number;
  title: string;
  category: string;
  published_at: string;
};

// ダークテーマ用のカテゴリバッジカラーマッピング
const CATEGORY_COLORS: Record<string, string> = {
  お知らせ: 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50',
  キャンペーン: 'bg-[#e6007e]/20 text-[#ff2a9d] border border-[#e6007e]/40 shadow-[0_0_6px_rgba(230,0,126,0.3)]',
  障害情報: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
};

export default function NewsSection() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, category, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('お知らせの取得に失敗しました:', error);
      } else if (data) {
        setNewsList(data);
      }
      setLoading(false);
    };

    fetchNews();
  }, [supabase]);

  if (loading || newsList.length === 0) return null;

  return (
    <section className="w-full py-3 bg-neutral-950 border-b border-neutral-800">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="text-xs font-black text-white flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          お知らせ
        </h2>
        <Link
          href="/news"
          className="text-xs text-[#ff2a9d] font-bold hover:text-[#ff66b8] transition-colors flex items-center gap-0.5"
        >
          一覧を見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* お知らせリスト */}
      <div className="px-3 divide-y divide-neutral-800/60">
        {newsList.map((item) => {
          const dateStr = new Date(item.published_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          return (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="py-2.5 flex flex-col gap-1 hover:bg-neutral-900/80 transition-all rounded-lg px-2 -mx-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500 font-medium">{dateStr}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    CATEGORY_COLORS[item.category] || 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-200 group-hover:text-[#ff2a9d] font-medium line-clamp-1 transition-colors">
                {item.title}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}