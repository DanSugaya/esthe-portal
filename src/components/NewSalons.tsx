'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
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
    <section className="w-full py-3 bg-white">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
          <span className="w-2 h-4 bg-amber-500 rounded-full inline-block" />
          新規掲載店
        </h2>
        <Link
          href="/salons"
          className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-0.5"
        >
          もっと見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* スライダー */}
      <Swiper
        modules={[FreeMode]}
        slidesPerView={1.8}
        spaceBetween={10}
        freeMode={true}
        className="w-full px-3"
      >
        {salons.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/salons/${item.id}`}
              className="block group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* アイキャッチ画像 ＆ エリア・NEWバッジ */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={item.image_url || 'https://picsum.photos/400/250'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  NEW
                </span>
                {item.area && (
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {item.area}
                  </span>
                )}
              </div>

              {/* 店舗名 ＆ キャッチコピー */}
              <div className="p-2">
                <p className="text-xs font-bold text-gray-800 truncate group-hover:text-amber-600">
                  {item.name}
                </p>
                {item.catchphrase && (
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
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