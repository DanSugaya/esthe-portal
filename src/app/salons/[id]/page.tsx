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

  // salons, areas, menus 情報をまとめて取得
  const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      description,
      header_image_url,
      areas (
        id,
        area_group,
        city,
        slug
      ),
      menus (
        id,
        name,
        description,
        duration,
        price
      )
    `)
    .eq('id', id)
    .single()

  if (error || !salon) {
    console.error('サロン取得エラー:', error)
    notFound()
  }

  // エリアデータの抽出（配列で返ってくる場合のセーフティガード）
  const areaData = Array.isArray(salon.areas) ? salon.areas[0] : salon.areas

  // 画像URLのフォールバック
  const displayImage =
    salon.header_image_url ||
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef'

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
          {/* 2. ヘッダー画像 */}
          <div className="relative h-72 md:h-96 w-full bg-gray-100">
            <Image
              src={displayImage}
              alt={salon.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* 3. 店舗情報 header */}
          <div className="p-6 md:p-8 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {salon.name}
            </h1>

            {salon.description && (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {salon.description}
              </p>
            )}
          </div>
        </article>

        {/* 4. 提供メニュー一覧 */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">
            施術メニュー
          </h2>

          {salon.menus && salon.menus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salon.menus.map((menu: any) => (
                <div
                  key={menu.id}
                  className="p-4 border border-gray-100 rounded-xl bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {menu.name}
                      </h3>
                      <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">
                        ¥{Number(menu.price).toLocaleString()}
                      </span>
                    </div>
                    {menu.description && (
                      <p className="text-xs text-gray-500 mb-2">
                        {menu.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    施術時間: 約{menu.duration}分
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">現在表示できるメニューはありません。</p>
          )}
        </section>
      </main>
    </div>
  )
}