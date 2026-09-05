'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/free-mode';

type Salon = {
  id: number;
  name: string;
  area: string;
  catchphrase: string;
  image_url: string;
  created_at: string;
};

export default function NewSalons() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNewSalons = async () => {
      // 掲載許可済み（is_published = true）の店舗を登録日時（created_at）の降順で取得
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('新規掲載店の取得に失敗しました:', error);
      } else if (data) {
        setSalons(data);
      }
      setLoading(false);
    };

    fetchNewSalons();
  }, [supabase]);

  if (loading || salons.length === 0) return null;

  return (
    <section className="w-full py-3 bg-neutral-950 border-b border-neutral-800">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="text-xs font-black text-white flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          新規掲載店
        </h2>
        <Link
          href="/salons"
          className="text-xs text-[#ff2a9d] font-bold hover:text-[#ff66b8] transition-colors flex items-center gap-0.5"
        >
          もっと見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* スライダー */}
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView={1.8}
        spaceBetween={10}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        className="w-full px-3 !pb-1"
      >
        {salons.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/salons/${item.id}`}
              className="block group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 hover:border-[#e6007e] hover:shadow-[0_0_12px_rgba(230,0,126,0.35)] transition-all duration-200"
            >
              {/* アイキャッチ画像 ＆ エリア・NEWバッジ */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950">
                <img
                  src={item.image_url || 'https://picsum.photos/400/250'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* NEWバッジ (発光ピンク) */}
                <span className="absolute top-1.5 left-1.5 bg-[#e6007e] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_0_6px_rgba(230,0,126,0.8)]">
                  NEW
                </span>

                {/* エリアバッジ */}
                {item.area && (
                  <span className="absolute bottom-1.5 left-1.5 bg-neutral-950/80 text-neutral-200 text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm border border-neutral-700/50">
                    {item.area}
                  </span>
                )}
              </div>

              {/* 店舗名 ＆ キャッチコピー */}
              <div className="p-2 bg-neutral-900">
                <p className="text-xs font-bold text-slate-100 group-hover:text-[#ff2a9d] truncate transition-colors">
                  {item.name}
                </p>
                {item.catchphrase && (
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {item.catchphrase}
                  </p>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}