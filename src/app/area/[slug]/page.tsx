import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShopCard from '@/components/ShopCard'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. スラグから対象のエリア情報を取得
  const { data: location, error: locationError } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (locationError || !location) {
    notFound()
  }

  // 2. salons テーブルから対象エリアのサロンおよび所属セラピストを取得
  const { data: salons, error: salonsError } = await supabase
    .from('salons')
    .select(`
      *,
      therapists (
        id,
        name,
        image_url
      )
    `)
    .eq('area_id', location.id)

  if (salonsError) {
    console.error('サロン取得エラー:', salonsError)
  }

  // パンくずリスト用のデータ定義
  const breadcrumbItems = [
    {
      label: location.area_group || 'エリア一覧',
      href: '/'
    },
    {
      label: location.city || location.name
    }
  ]

  return (
    <div className="bg-neutral-950 min-h-screen pb-12 text-slate-100 font-sans selection:bg-[#e6007e] selection:text-white">
      <Breadcrumbs items={breadcrumbItems} />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* ページタイトルバー */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-[#e6007e] rounded-full shadow-[0_0_8px_rgba(230,0,126,0.8)]" />
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
            {location.city || location.name}のサロン一覧
          </h1>
        </div>

        {salons && salons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <ShopCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/60 text-center text-neutral-400 text-xs md:text-sm shadow-xl">
            現在、このエリア（{location.city || location.name}）に登録されているサロンはありません。
          </div>
        )}
      </main>
    </div>
  )
}