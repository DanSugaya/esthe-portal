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

// カテゴリに応じたバッジカラーのマッピング
const CATEGORY_COLORS: Record<string, string> = {
  お知らせ: 'bg-blue-100 text-blue-700',
  キャンペーン: 'bg-pink-100 text-pink-700',
  障害情報: 'bg-amber-100 text-amber-700',
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
    <section className="w-full py-3 bg-white">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
          <span className="w-2 h-4 bg-amber-500 rounded-full inline-block" />
          お知らせ
        </h2>
        <Link
          href="/news"
          className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-0.5"
        >
          一覧を見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* お知らせリスト */}
      <div className="px-3 divide-y divide-gray-100">
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
              className="py-2.5 flex flex-col gap-1 hover:bg-gray-50 transition-colors rounded px-1 -mx-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 font-medium">{dateStr}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-gray-800 font-medium line-clamp-1">
                {item.title}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}