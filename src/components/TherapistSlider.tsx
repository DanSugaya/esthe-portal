'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
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
      // エラー回避のため is_available や sort_order の絞り込みを外し、最大8名を取得
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
    <section className="w-full py-3 bg-white">
      {/* 見出しエリア */}
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
          <span className="w-2 h-4 bg-pink-500 rounded-full inline-block" />
          今すぐご案内できるセラピスト
        </h2>
        <Link
          href="/therapists"
          className="text-xs text-pink-600 font-semibold hover:underline flex items-center gap-0.5"
        >
          もっと見る
          <span className="text-sm">›</span>
        </Link>
      </div>

      {/* 手動スライド (横スクロール) エリア */}
      <Swiper
        modules={[FreeMode]}
        slidesPerView={3.4} // スマホ画面で3枚半ほど見せてスクロールを促す
        spaceBetween={8}
        freeMode={true}
        className="w-full px-3"
      >
        {/* セラピスト 1〜8人目のカード */}
        {therapists.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/therapists/${item.id}`}
              className="block group overflow-hidden rounded-md border border-gray-100 bg-gray-50"
            >
              {/* 縦位置画像（アスペクト比 3:4） */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-200">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              {/* 名前・年齢キャプション */}
              <div className="p-1.5 text-center">
                <p className="text-xs font-bold text-gray-800 truncate">
                  {item.name}
                  {item.age && <span className="text-[10px] font-normal text-gray-500 ml-1">({item.age})</span>}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}

        {/* 9枚目: もっと見る（一覧へ）カード */}
        <SwiperSlide>
          <Link
            href="/therapists"
            className="flex flex-col items-center justify-center w-full aspect-[3/4] rounded-md border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-1 shadow-sm">
              <span className="text-pink-500 text-lg font-bold">›</span>
            </div>
            <span className="text-xs font-bold text-gray-700">もっと見る</span>
            <span className="text-[10px] text-gray-400">一覧へ</span>
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}