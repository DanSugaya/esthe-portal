import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SalonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // salons テーブルから name と image_url、およびパンくず用のエリア情報を取得
  const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      image_url,
      areas!area_id (
        id,
        area_group,
        city,
        slug
      )
    `)
    .eq('id', id)
    .single()

  if (error || !salon) {
    console.error('サロン取得エラー:', error)
    notFound()
  }

  // エリアデータの抽出
  const areaData = Array.isArray(salon.areas) ? salon.areas[0] : salon.areas

  // パンくずリスト用のデータ
  const breadcrumbItems = [
    {
      label: areaData?.area_group || 'エリア一覧',
      href: '/'
    },
    {
      label: areaData?.city || 'エリア',
      href: areaData?.slug ? `/area/${areaData.slug}` : undefined
    },
    {
      label: salon.name
    }
  ]

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* 1. パンくずリスト */}
      <Breadcrumbs items={breadcrumbItems} />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* 2. 画像 (salons.image_url) */}
          {salon.image_url ? (
            <div className="relative h-72 md:h-96 w-full bg-gray-100">
              <Image
                src={salon.image_url}
                alt={salon.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-60 w-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* 3. 店舗名 (salons.name) */}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {salon.name}
            </h1>
          </div>
        </article>
      </main>
    </div>
  )
}