'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

type LocationItem = {
  id: number;
  city: string;
  area_group: string;
  parent_area: string;
  slug: string;
  salons: { id: number }[] | null;
};

export default function AreaSlider({ locations }: { locations: LocationItem[] }) {
  return (
    <Swiper
      modules={[FreeMode, Mousewheel]}
      slidesPerView="auto"
      spaceBetween={10}
      freeMode={true}
      mousewheel={{ forceToAxis: true }}
      className="w-full px-3 !pb-1"
    >
      {locations.map((loc) => {
        const salonList = Array.isArray(loc.salons) ? loc.salons : [];
        const count = salonList.length;

        return (
          <SwiperSlide key={loc.id} className="!w-auto">
            <Link
              href={`/area/${loc.slug}`}
              className="w-20 h-20 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 hover:border-[#e6007e] shadow-md flex flex-col items-center justify-center p-1 text-center shrink-0 active:scale-95 hover:shadow-[0_0_12px_rgba(230,0,126,0.35)] transition-all duration-200 relative group"
            >
              {/* 店舗数バッジ */}
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-[#e6007e] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                  {count}
                </span>
              )}

              {/* MapPin アイコン */}
              <div className="w-7 h-7 rounded-full bg-[#e6007e]/10 border border-[#e6007e]/30 flex items-center justify-center mb-1 text-[#ff2a9d] group-hover:scale-110 group-hover:bg-[#e6007e] group-hover:text-white transition-all">
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* 市区町村名 */}
              <span className="text-[11px] font-bold text-slate-100 group-hover:text-[#ff2a9d] leading-tight line-clamp-1 transition-colors">
                {loc.city || 'エリア'}
              </span>

              {/* エリアグループ */}
              <span className="text-[9px] text-neutral-400 scale-90 leading-none mt-0.5 line-clamp-1">
                {loc.area_group || ''}
              </span>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}