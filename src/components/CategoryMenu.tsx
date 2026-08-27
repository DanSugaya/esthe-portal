'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Store, Building, Car, Grid } from 'lucide-react';

type Category = {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
};

// 新しいカテゴリに対応する Lucide アイコンのマッピング
const ICON_MAP: Record<string, React.ReactNode> = {
  Store: <Store className="w-5 h-5 text-amber-500" />,
  Building: <Building className="w-5 h-5 text-blue-500" />,
  Car: <Car className="w-5 h-5 text-emerald-500" />,
};

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('カテゴリの取得に失敗しました:', error);
      } else if (data) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [supabase]);

  if (loading) return null;

  return (
    <section className="w-full py-3 bg-white border-b border-gray-100">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
          <span className="w-2 h-4 bg-amber-500 rounded-full inline-block" />
          営業形態から探す
        </h2>
      </div>

      {/* カテゴリグリッド（3列表示） */}
      <div className="grid grid-cols-3 gap-2 px-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/salons?category=${cat.slug}`}
            className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-amber-50/50 hover:border-amber-200 transition-colors group"
          >
            <div className="p-2.5 rounded-full bg-white shadow-sm mb-1.5 group-hover:scale-110 transition-transform">
              {ICON_MAP[cat.icon_name] || <Grid className="w-5 h-5 text-gray-400" />}
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-amber-600 truncate max-w-full">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}