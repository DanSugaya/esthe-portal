import AreaMenu from '@/components/AreaMenu';
import RotationBanner from '@/components/RotationBanner';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* エリアメニュー */}
      <section>
        <AreaMenu />
      </section>

      {/* バナースライダー */}
      <section>
        <RotationBanner />
      </section>
    </div>
  );
}