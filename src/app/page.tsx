import AreaMenu from '@/components/AreaMenu';
import RotationBanner from '@/components/RotationBanner';
import SubBannerSlider from '@/components/SubBannerSlider';
import TherapistSlider from '@/components/TherapistSlider';

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

      {/* 今すぐご案内できるセラピスト */}
      <section>
        <TherapistSlider />
      </section>
    </div>
  );
}