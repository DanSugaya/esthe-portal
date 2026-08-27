'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Sparkles, Droplets, Activity, Sun, Shield, Flame, Grid } from 'lucide-react';

type Category = {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
};

// アイコン名とLucideコンポーネントの対応マッピング
const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Droplets: <Droplets className="w-5 h-5 text-blue-500" />,
  Activity: <Activity className="w-5 h-5 text-emerald-500" />,
  Sun: <Sun className="w-5 h-5 text-purple-500" />,
  Shield: <Shield className="w-5 h-5 text-rose-500" />,
  Flame: <Flame className="w-5 h-5 text-orange-500" />,
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
          業種から探す
        </h2>
      </div>

      {/* カテゴリグリッド（3列表示） */}
      <div className="grid grid-cols-3 gap-2 px-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/salons?category=${cat.slug}`}
            className="flex flex-col items-center justify-center p-2.5 bg-gray-50 border border-gray-100 rounded-lg hover:bg-amber-50/50 hover:border-amber-200 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-sm mb-1.5 group-hover:scale-110 transition-transform">
              {ICON_MAP[cat.icon_name] || <Grid className="w-5 h-5 text-gray-400" />}
            </div>
            <span className="text-xs font-medium text-gray-700 group-hover:text-amber-600 truncate max-w-full">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}