import AreaMenu from '@/components/AreaMenu';
import RotationBanner from '@/components/RotationBanner';
import SubBannerSlider from '@/components/SubBannerSlider';

export default function HomePage() {
  return (
    <div>
      {/* エリアメニュー */}
      <section>
        <AreaMenu />
      </section>

      {/* メインバナー（自動ローテーション） */}
      <section className="mt-0 pt-0">
        <RotationBanner />
      </section>

      {/* サブバナー（スクエア横スクロール） */}
      <section className="mt-0 pt-0">
        <SubBannerSlider />
      </section>
    </div>
  );
}