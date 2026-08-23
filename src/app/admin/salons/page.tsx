import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const revalidate = 0

export default async function HomePage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component からの書き込みエラーを防止
          }
        },
      },
    }
  )

  // 承認済み (approved) の店舗のみ取得
  const { data: salons, error } = await supabase
    .from('salons')
    .select(`
      *,
      menus (*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ヒーローセクション */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            理想のサロンを見つけて、スムーズ予約
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            厳選されたサロンのメニュー閲覧から事前予約までWebで完結。
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/owner/register"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition"
            >
              店舗を掲載する（サロン様向け）
            </Link>
          </div>
        </div>
      </section>

      {/* サロン一覧 */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6">掲載サロン一覧</h2>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg mb-6">
            サロン情報の取得に失敗しました: {error.message}
          </div>
        )}

        {!salons || salons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm">現在、掲載中のサロンはありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <div
                key={salon.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={salon.image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{salon.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {salon.description || '店舗紹介文がありません。'}
                    </p>
                  </div>

                  {salon.menus && salon.menus.length > 0 && (
                    <div className="border-t border-slate-100 pt-3 mt-auto">
                      <p className="text-xs font-semibold text-slate-400 mb-1">代表メニュー</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">{salon.menus[0].title}</span>
                        <span className="font-bold text-emerald-600">
                          ¥{salon.menus[0].price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/salons/${salon.id}`}
                    className="mt-4 w-full block text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg transition"
                  >
                    詳細・メニューを見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}