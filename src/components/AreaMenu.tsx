// src/components/AreaMenu.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AreaMenu() {
  const supabase = await createClient()

  // 1. use_locations テーブルからエリア情報を取得
  const { data: locations, error } = await supabase
    .from('use_locations')
    .select(`
      id,
      city,
      area_group,
      area_slug,
      slug,
      salons ( id )
    `)

  if (error || !locations) {
    return null
  }

  // 重複する area_slug をまとめて、配下のサロン件数を集計する処理
  const areaMap = new Map<string, { city: string; areaGroup: string; count: number }>()

  locations.forEach((loc) => {
    // リレーションで取得した salons の件数
    const salonCount = Array.isArray(loc.salons) ? loc.salons.length : 0

    if (areaMap.has(loc.area_slug)) {
      const current = areaMap.get(loc.area_slug)!
      current.count += salonCount
    } else {
      areaMap.set(loc.area_slug, {
        city: loc.city,
        areaGroup: loc.area_group,
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
              {/* サロン掲載数バッジ */}
              {data.count > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
                  {data.count}
                </span>
              )}

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