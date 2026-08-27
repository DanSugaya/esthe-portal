import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default async function AreaMenu() {
  let locations: any[] | null = null
  let fetchError: string | null = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('areas')
      .select(`
        id,
        city,
        area_group,
        parent_area,
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

  if (fetchError) {
    return (
      <div className="p-3 text-[11px] text-red-500 bg-red-50 text-center border-b">
        エリアデータ取得エラー: {fetchError}
      </div>
    )
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="p-3 text-[11px] text-gray-400 text-center border-b">
        エリアデータが登録されていません (0件)
      </div>
    )
  }

  return (
    <section className="w-full py-3 bg-gray-50 border-b border-gray-200">
      <div className="px-3 mb-2 flex justify-between items-center">
        <h2 className="text-xs font-bold text-gray-700">エリアから探す</h2>
      </div>

      <div className="flex overflow-x-auto px-3 pb-2 gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
        <div className="grid grid-rows-2 grid-flow-col gap-2">
          {locations.map((loc) => {
            const salonList = Array.isArray(loc.salons) ? loc.salons : []
            const count = salonList.length

            return (
              <Link
                key={loc.id}
                href={`/area/${loc.slug}`}
                className="w-20 h-20 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center p-1 text-center snap-start active:scale-95 transition-transform relative"
              >
                {count > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
                    {count}
                  </span>
                )}

                <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center mb-1 text-amber-500">
                  <MapPin className="w-3.5 h-3.5" />
                </div>

                <span className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-1">
                  {loc.city || 'エリア'}
                </span>
                <span className="text-[9px] text-gray-400 scale-90 leading-none mt-0.5">
                  {loc.area_group || ''}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}