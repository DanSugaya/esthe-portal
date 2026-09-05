'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/free-mode';

type Therapist = {
  id: string;
  name: string;
  image_url: string;
  age?: number;
};

export default function TherapistSlider() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTherapists = async () => {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .limit(8);

      if (error) {
        console.error('セラピストデータの取得に失敗しました:', error);
      } else if (data) {
        setTherapists(data);
      }
      setLoading(false);
    };

    fetchTherapists();
  }, [supabase]);

  if (loading || therapists.length === 0) return null;

  return (
    <section className="w-full py-3 bg-neutral-950 border-b border-neutral-800">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="text-xs font-black text-white flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          今すぐご案内できるセラピスト
        </h2>
        <Link
          href="/therapists"
          className="text-xs text-[#ff2a9d] font-bold hover:text-[#ff66b8] transition-colors flex items-center gap-0.5"
        >
          もっと見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* スライド (横スクロール) エリア */}
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView={3.4}
        spaceBetween={8}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        className="w-full px-3 !pb-1"
      >
        {/* セラピスト 1〜8人目のカード */}
        {therapists.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/therapists/${item.id}`}
              className="block group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 hover:border-[#e6007e] hover:shadow-[0_0_12px_rgba(230,0,126,0.35)] transition-all duration-200"
            >
              {/* 縦位置画像（アスペクト比 3:4） */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* 即出勤・おすすめ風グラデーションオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-80" />
              </div>

              {/* 名前・年齢キャプション */}
              <div className="p-2 text-center bg-neutral-900">
                <p className="text-xs font-bold text-slate-100 group-hover:text-[#ff2a9d] truncate transition-colors">
                  {item.name}
                  {item.age && (
                    <span className="text-[10px] font-normal text-neutral-400 ml-1">
                      ({item.age})
                    </span>
                  )}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}

        {/* 9枚目: もっと見る（一覧へ）カード */}
        <SwiperSlide>
          <Link
            href="/therapists"
            className="flex flex-col items-center justify-center w-full aspect-[3/4] rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:border-[#e6007e] hover:text-[#ff2a9d] hover:bg-neutral-900 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-700 group-hover:border-[#e6007e] flex items-center justify-center mb-1 shadow-inner transition-colors">
              <span className="text-[#ff2a9d] text-lg font-black group-hover:scale-125 transition-transform">
                ›
              </span>
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-[#ff2a9d]">もっと見る</span>
            <span className="text-[10px] text-neutral-500">一覧へ</span>
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}