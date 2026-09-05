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

// ショッキングピンク統一のアイコンマッピング
const ICON_MAP: Record<string, React.ReactNode> = {
  Store: <Store className="w-5 h-5 text-[#ff2a9d]" />,
  Building: <Building className="w-5 h-5 text-[#ff2a9d]" />,
  Car: <Car className="w-5 h-5 text-[#ff2a9d]" />,
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
    <section className="w-full py-3 bg-neutral-950 border-b border-neutral-800">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="text-xs font-black text-white flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          営業形態から探す
        </h2>
      </div>

      {/* カテゴリグリッド（3列表示） */}
      <div className="grid grid-cols-3 gap-2 px-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center justify-center p-3 bg-neutral-900 border border-neutral-800 hover:border-[#e6007e] rounded-xl hover:shadow-[0_0_12px_rgba(230,0,126,0.3)] transition-all duration-200 active:scale-95 group"
          >
            <div className="p-2.5 rounded-full bg-neutral-950 border border-[#e6007e]/30 group-hover:bg-[#e6007e] mb-1.5 group-hover:scale-110 transition-all duration-200 shadow-inner">
              {ICON_MAP[cat.icon_name] ? (
                // ホバー時にアイコン色を白に変える制御
                <span className="[&>svg]:group-hover:text-white transition-colors">
                  {ICON_MAP[cat.icon_name]}
                </span>
              ) : (
                <Grid className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              )}
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-[#ff2a9d] truncate max-w-full transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}