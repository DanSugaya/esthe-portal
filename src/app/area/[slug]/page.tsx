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
    <div className="bg-slate-50 min-h-screen pb-12">
      <Breadcrumbs items={breadcrumbItems} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {location.city || location.name}のサロン一覧
        </h1>

        {salons && salons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <ShopCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            現在、このエリア（{location.city}）に登録されているサロンはありません。
          </p>
        )}
      </main>
    </div>
  )
}