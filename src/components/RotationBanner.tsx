'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Swiper の CSS をインポート
import 'swiper/css';
import 'swiper/css/pagination';

type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
};

export default function RotationBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('バナーの取得に失敗しました:', error);
      } else if (data) {
        setBanners(data);
      }
      setLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  // 読み込み中または有効なバナーが無い場合は何も表示しない（またはスケルトン表示）
  if (loading || banners.length === 0) return null;

  return (
    <div className="w-full max-w-[412px] mx-auto my-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={banners.length > 1} // 1枚だけの時はループしない
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-lg overflow-hidden"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a
              href={banner.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                width={377}
                height={118}
                className="w-full h-auto object-cover rounded-lg"
                loading="lazy"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}