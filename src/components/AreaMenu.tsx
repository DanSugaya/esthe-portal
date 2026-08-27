// src/components/AreaMenu.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default async function AreaMenu() {
  let locations: any[] | null = null
  let fetchError: string | null = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('use_locations')
      .select(`
        id,
        city,
        area_group,
        area_slug,
        slug,
        salons ( id )
      `)

    if (error) {
      fetchError = error.message
    } else {
      locations = data
    }
  } catch (err: any) {
    fetchError = err?.message || 'Supabase接続エラー'
  }

  // エラー発生時の画面表示
  if (fetchError) {
    return (
      <div className="p-3 text-[11px] text-red-500 bg-red-50 text-center border-b">
        エリアデータ取得エラー: {fetchError}
      </div>
    )
  }

  // データが0件の場合の画面表示
  if (!locations || locations.length === 0) {
    return (
      <div className="p-3 text-[11px] text-gray-400 text-center border-b">
        エリアデータが登録されていません (0件)
      </div>
    )
  }

  // area_slug ごとに集計
  const areaMap = new Map<string, { city: string; areaGroup: string; count: number }>()

  locations.forEach((loc) => {
    if (!loc.area_slug) return

    const salonList = Array.isArray(loc.salons) ? loc.salons : []
    const salonCount = salonList.length

    if (areaMap.has(loc.area_slug)) {
      const current = areaMap.get(loc.area_slug)!
      current.count += salonCount
    } else {
      areaMap.set(loc.area_slug, {
        city: loc.city || 'エリア',
        areaGroup: loc.area_group || '',
        count: salonCount,
      })
    }
  })

  return (
    <section className="w-full py-3 bg-gray-50 border-b border-gray-200">
      <div className="px-3 mb-2 flex justify-between items-center">
        <h2 className="text-xs font-bold text-gray-700">エリアから探す</h2>
        <span className="text-[10px] text-gray-400">横にスワイプ ➔</span>
      </div>

      <div className="flex overflow-x-auto px-3 pb-2 gap-2 scrollbar-hide snap-x">
        <div className="grid grid-rows-2 grid-flow-col gap-2">
          {Array.from(areaMap.entries()).map(([areaSlug, data]) => (
            <Link
              key={areaSlug}
              href={`/area/${areaSlug}`}
              className="w-20 h-20 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center p-1 text-center snap-start active:scale-95 transition-transform relative"
            >
              {/* 店舗数バッジ */}
              {data.count > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
                  {data.count}
                </span>
              )}

              {/* アイコン */}
              <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center mb-1 text-amber-500">
                <MapPin className="w-3.5 h-3.5" />
              </div>

              <span className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-1">
                {data.city}
              </span>
              <span className="text-[9px] text-gray-400 scale-90 leading-none mt-0.5">
                {data.areaGroup}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}