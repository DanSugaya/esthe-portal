import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    area_slug: string
    slug: string
  }>
}

export default async function AreaPage({ params }: PageProps) {
  const { area_slug, slug } = await params
  const supabase = await createClient()

  // 1. スラグから対象のエリア情報を取得（例: area_slug='saitama', slug='omiya' → city='大宮'）
  const { data: location, error: locationError } = await supabase
    .from('use_locations')
    .select('*')
    .eq('area_slug', area_slug)
    .eq('slug', slug)
    .maybeSingle()

  if (locationError || !location) {
    notFound()
  }

  // 2. salons テーブルの area カラム（'大宮'）または location_id と一致するサロンを取得
  const { data: salons, error: salonsError } = await supabase
    .from('salons')
    .select('*')
    .or(`area.eq.${location.city},location_id.eq.${location.id}`)

  if (salonsError) {
    console.error('サロン取得エラー:', salonsError)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {location.city || location.name}のサロン一覧
      </h1>

      {salons && salons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <Link
              key={salon.id}
              href={`/salons/${salon.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition bg-white block"
            >
              <h2 className="text-lg font-bold mb-2">{salon.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {salon.description || '説明はありません'}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          現在、このエリア（{location.city}）に登録されているサロンはありません。
        </p>
      )}
    </main>
  )
}