import AreaMenu from '@/components/AreaMenu';
import CategoryMenu from '@/components/CategoryMenu'; // 追加
import RotationBanner from '@/components/RotationBanner';
import SubBannerSlider from '@/components/SubBannerSlider';
import TherapistSlider from '@/components/TherapistSlider';
import NewSalons from '@/components/NewSalons';

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

      {/* 新規掲載店 */}
      <section>
        <NewSalons />
      </section>
    </div>
  );
}