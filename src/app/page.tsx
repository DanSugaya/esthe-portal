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
    <div className="space-y-6 pb-12">
      {/* メインエリア・カテゴリナビ */}
      <section className="bg-white p-4">
        <AreaMenu />
      </section>

      {/* バナー領域 */}
      <section className="space-y-3">
        <RotationBanner />
        <SubBannerSlider />
      </section>

      {/* 業種カテゴリ */}
      <section>
        <CategoryMenu />
      </section>

      {/* セラピスト情報 */}
      <section className="py-2">
        <h2 className="text-lg font-bold px-4 mb-2 border-l-4 border-emerald-500">
          今すぐご案内できるセラピスト
        </h2>
        <TherapistSlider />
      </section>

      {/* 写メ日記 */}
      <section className="py-2">
        <h2 className="text-lg font-bold px-4 mb-2 border-l-4 border-pink-500">
          最新の写メ日記
        </h2>
        <DiarySection />
      </section>

      {/* 新規掲載店 */}
      <section className="py-2">
        <h2 className="text-lg font-bold px-4 mb-2 border-l-4 border-blue-500">
          NEW OPENの店舗
        </h2>
        <NewSalons />
      </section>

      {/* お知らせ */}
      <section className="px-4">
        <NewsSection />
      </section>
    </div>
  );
}