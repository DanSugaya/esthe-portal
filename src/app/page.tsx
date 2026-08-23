import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  // salons テーブルと、それに紐づく menus テーブルを取得（statusが'approved'のもののみ）
  const { data: salons, error } = await supabase
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
    .eq('status', 'approved')

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-500">
        データの取得に失敗しました: {error.message}
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">エステサロン一覧</h1>
        <p className="text-gray-600 text-sm mt-1">おすすめのエステサロンと施術メニューを探せます</p>
      </header>

      {!salons || salons.length === 0 ? (
        <p className="text-gray-500">登録されているサロンがありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <div
              key={salon.id}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col"
            >
              {/* サロン画像リンク */}
              <Link href={`/salons/${salon.id}`} className="block relative h-48 w-full bg-gray-100 overflow-hidden group">
                {salon.image_url ? (
                  <img
                    src={salon.image_url}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* サロン名リンク */}
                  <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-emerald-600 transition">
                    <Link href={`/salons/${salon.id}`}>
                      {salon.name}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {salon.description}
                  </p>
                </div>

                <div className="border-t pt-4 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    メニュー
                  </h3>
                  {salon.menus && salon.menus.length > 0 ? (
                    <ul className="space-y-2">
                      {salon.menus.map((menu: any) => (
                        <li
                          key={menu.id}
                          className="text-sm flex justify-between items-center text-gray-700 bg-gray-50 p-2 rounded"
                        >
                          <div>
                            <span className="font-medium block">{menu.title}</span>
                            <span className="text-xs text-gray-500">{menu.duration}分</span>
                          </div>
                          <span className="font-semibold text-emerald-600">
                            ¥{menu.price?.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400">メニュー未登録</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}