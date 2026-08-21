import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SalonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      image_url,
      description,
      menus (
        id,
        title,
        duration,
        price
      )
    `)
    .eq('id', id)
    .single()

  if (error || !salon) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* 戻るボタン (&larr; を使用) */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6 transition"
      >
        &larr; サロン一覧に戻る
      </Link>

      {/* メインカード */}
      <article className="bg-white rounded-2xl border overflow-hidden shadow-sm mb-8">
        {salon.image_url ? (
          <div className="relative h-72 md:h-96 w-full bg-gray-100">
            <img
              src={salon.image_url}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-60 w-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {salon.name}
          </h1>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
            {salon.description}
          </p>
        </div>
      </article>

      {/* メニュー一覧セクション */}
      <section className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
          施術メニュー一覧
        </h2>

        {!salon.menus || salon.menus.length === 0 ? (
          <p className="text-gray-500">現在提供中のメニューはありません。</p>
        ) : (
          <div className="grid gap-4">
            {salon.menus.map((menu: any) => (
              <div
                key={menu.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-emerald-500 transition bg-gray-50/50 gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {menu.title}
                  </h3>
                  <span className="inline-block text-xs text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
                    所要時間: {menu.duration}分
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-xl font-bold text-emerald-600">
                    ¥{menu.price?.toLocaleString()}
                  </span>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition shadow-sm">
                    予約する
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}