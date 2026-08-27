'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  type: string;
};

export default function RotationBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      // type が 'main' のバナーのみを取得
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('type', 'main')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('メインバナーの取得に失敗しました:', error);
      } else if (data) {
        setBanners(data);
      }
      setLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  if (loading || banners.length === 0) return null;

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={banners.length > 1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="w-full compact-swiper"
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
                className="w-full h-auto block object-cover rounded-none"
                loading="lazy"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}