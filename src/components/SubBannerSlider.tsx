'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
};

export default function SubBannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      // type が 'sub' かつ有効なバナーを取得
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('type', 'sub')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('サブバナーの取得に失敗しました:', error);
      } else if (data) {
        setBanners(data);
      }
      setLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  if (loading || banners.length === 0) return null;

  return (
    <div className="w-full pt-1 pb-2">
      <Swiper
        modules={[FreeMode]}
        slidesPerView={4.2} // 4枚＋次の画像をちらっと見せてスライドを促す
        spaceBetween={4}   // バナー同士の隙間を狭く設定
        freeMode={true}    // 滑らかな手動スクロールを有効化
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a
              href={banner.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full aspect-square overflow-hidden"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}