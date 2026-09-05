import AreaMenu from '@/components/AreaMenu';
import CategoryMenu from '@/components/CategoryMenu';
import RotationBanner from '@/components/RotationBanner';
import SubBannerSlider from '@/components/SubBannerSlider';
import TherapistSlider from '@/components/TherapistSlider';
import DiarySection from '@/components/DiarySection';
import NewSalons from '@/components/NewSalons';
import NewsSection from '@/components/NewsSection';

export default function HomePage() {
  return (
    <div className="space-y-6 pb-12 bg-neutral-950 text-slate-100 font-sans selection:bg-[#e6007e] selection:text-white">
      
      {/* メインエリアナビ */}
      <section className="bg-neutral-900/90 p-4 border-b border-neutral-800 shadow-lg">
        <AreaMenu />
      </section>

      {/* バナー領域 */}
      <section className="space-y-3 px-2">
        <RotationBanner />
        <SubBannerSlider />
      </section>

      {/* 業種カテゴリ */}
      <section className="px-2">
        <CategoryMenu />
      </section>

      {/* セラピスト情報 */}
      <section className="py-2">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-6 bg-[#e6007e] rounded-full shadow-[0_0_8px_rgba(230,0,126,0.8)]"></span>
          <h2 className="text-lg font-black tracking-wide text-white">
            今すぐご案内できるセラピスト
          </h2>
        </div>
        <TherapistSlider />
      </section>

      {/* 写メ日記 */}
      <section className="py-2">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-6 bg-gradient-to-b from-[#ff2a9d] to-[#e6007e] rounded-full shadow-[0_0_8px_rgba(255,42,157,0.8)]"></span>
          <h2 className="text-lg font-black tracking-wide text-white">
            最新の写メ日記
          </h2>
        </div>
        <DiarySection />
      </section>

      {/* 新規掲載店 */}
      <section className="py-2">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-6 bg-[#ff2a9d] rounded-full shadow-[0_0_8px_rgba(255,42,157,0.8)]"></span>
          <h2 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
            NEW OPENの店舗
            <span className="text-[10px] bg-[#e6007e] text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-widest animate-pulse">
              NEW
            </span>
          </h2>
        </div>
        <NewSalons />
      </section>

      {/* お知らせ */}
      <section className="px-4">
        <NewsSection />
      </section>
    </div>
  );
}