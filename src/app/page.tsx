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
    <div className="space-y-4 pb-12 bg-neutral-950 text-slate-100 font-sans selection:bg-[#e6007e] selection:text-white">
      {/* メインエリアナビ */}
      <section className="bg-neutral-900/90 border-b border-neutral-800 shadow-lg">
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
      <section>
        <TherapistSlider />
      </section>

      {/* 写メ日記 */}
      <section>
        <DiarySection />
      </section>

      {/* 新規掲載店 */}
      <section>
        <NewSalons />
      </section>

      {/* お知らせ */}
      <section>
        <NewsSection />
      </section>
    </div>
  );
}