import AreaMenu from '@/components/AreaMenu';
import CategoryMenu from '@/components/CategoryMenu';
import RotationBanner from '@/components/RotationBanner';
import SubBannerSlider from '@/components/SubBannerSlider';
import TherapistSlider from '@/components/TherapistSlider';
import DiarySection from '@/components/DiarySection'; // 追加
import NewSalons from '@/components/NewSalons';
import NewsSection from '@/components/NewsSection';

export default function HomePage() {
  return (
    <div className="space-y-2">
      {/* エリアメニュー */}
      <section>
        <AreaMenu />
      </section>

      

      {/* メインローテーションバナー */}
      <section>
        <RotationBanner />
      </section>

      {/* サブスクエアバナー */}
      <section>
        <SubBannerSlider />
      </section>

      {/* 業種（カテゴリ）メニュー */}
      <section>
        <CategoryMenu />
      </section>

      {/* 今すぐご案内できるセラピスト */}
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