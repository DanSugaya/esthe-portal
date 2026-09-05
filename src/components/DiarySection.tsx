'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/free-mode';

type DiaryItem = {
  id: number;
  title: string;
  image_url: string;
  published_at: string;
  therapists: {
    name: string;
  } | null;
  salons: {
    name: string;
  } | null;
};

export default function DiarySection() {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDiaries = async () => {
      const { data, error } = await supabase
        .from('diaries')
        .select(`
          id,
          title,
          image_url,
          published_at,
          therapists ( name ),
          salons ( name )
        `)
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('写メ日記の取得に失敗しました:', error);
      } else if (data) {
        setDiaries(data as unknown as DiaryItem[]);
      }
      setLoading(false);
    };

    fetchDiaries();
  }, [supabase]);

  if (loading || diaries.length === 0) return null;

  return (
    <section className="w-full py-3 bg-neutral-950 border-b border-neutral-800">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="text-xs font-black text-white flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          最新の写メ日記
        </h2>
        <Link
          href="/diaries"
          className="text-xs text-[#ff2a9d] font-bold hover:text-[#ff66b8] transition-colors flex items-center gap-0.5"
        >
          もっと見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* スライダー */}
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView={2.3}
        spaceBetween={10}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        className="w-full px-3 !pb-1"
      >
        {diaries.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/diaries/${item.id}`}
              className="block group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 hover:border-[#e6007e] hover:shadow-[0_0_12px_rgba(230,0,126,0.35)] transition-all duration-200"
            >
              {/* 写真エリア（縦長アスペクト比 4:5） */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-950">
                <img
                  src={item.image_url || 'https://picsum.photos/400/500'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* グラデーションオーバーレイ ＆ セラピスト名・店舗名 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-2 text-white">
                  <p className="text-xs font-bold truncate text-slate-100 group-hover:text-[#ff2a9d] transition-colors">
                    {item.therapists?.name || 'セラピスト'}
                  </p>
                  {item.salons?.name && (
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {item.salons.name}
                    </p>
                  )}
                </div>
              </div>

              {/* 日記タイトル */}
              <div className="p-2 bg-neutral-900">
                <p className="text-xs text-slate-300 font-medium line-clamp-1 group-hover:text-white transition-colors">
                  {item.title}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}