// src/app/area/[area_slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ area_slug: string }>
}

export default async function AreaDetailPage({ params }: Props) {
  const { area_slug } = await params
  const supabase = await createClient()

  // area_slug に一致する use_locations と、そこに紐づく salons を取得
  const { data: locations, error } = await supabase
    .from('use_locations')
    .select(`
      id,
      city,
      area_group,
      salons (
        id,
        name,
        description,
        status
      )
    `)
    .eq('area_slug', area_slug)

  if (error || !locations || locations.length === 0) {
    notFound()
  }

  // 該当するエリア内のすべてのサロンを平坦化（フラットな配列に）
  const areaName = locations[0].city
  const salons = locations
    .flatMap((loc) => loc.salons)
    .filter((salon) => salon.status === 'approved')

  return (
    <main className="p-3 space-y-3">
      <div className="border-b pb-2">
        <h1 className="text-sm font-bold text-gray-800">
          {areaName}のサロン一覧 ({salons.length}件)
        </h1>
      </div>

      {salons.length === 0 ? (
        <p className="text-xs text-gray-400 py-8 text-center">
          このエリアには現在登録されている店舗がありません。
        </p>
      ) : (
        salons.map((salon) => (
          <Link
            key={salon.id}
            href={`/salons/${salon.id}`}
            className="block bg-white rounded-lg border p-2.5 shadow-sm"
          >
            <h2 className="font-bold text-xs">{salon.name}</h2>
            <p className="text-[10px] text-gray-500 line-clamp-2">{salon.description}</p>
          </Link>
        ))
      )}
    </main>
  )
}