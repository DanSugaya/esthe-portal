// app/page.tsx
import AreaMenu from '@/components/AreaMenu'

export default function HomePage() {
  return (
    <main className="py-2">
      {/* トップページ専用エリアメニュー */}
      <AreaMenu />

      {/* 今後店舗一覧などを追加する場合はここに配置 */}
    </main>
  )
}