import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReviewForm from '@/components/ReviewForm'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SalonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. ログイン状態の確認
  const { data: { session } } = await supabase.auth.getSession()

  // 2. サロン情報、メニュー、および口コミを取得
  const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      header_image_url,
      description,
      phone,
      address,
      menus (
        id,
        name,
        description,
        duration,
        price
      ),
      reviews (
        id,
        rating,
        comment,
        therapist_name,
        is_verified_by_contract,
        created_at,
        menus ( name )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !salon) {
    notFound()
  }

  // 3. 平均評価の計算
  const reviews = salon.reviews || []
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 戻るボタン */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition"
      >
        &larr; サロン一覧に戻る
      </Link>

      {/* メインサロンカード */}
      <article className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        {salon.header_image_url ? (
          <div className="relative h-72 md:h-96 w-full bg-gray-100">
            <img
              src={salon.header_image_url}
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
          <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {salon.name}
            </h1>

            {/* 総合評価の表示 */}
            {avgRating && (
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                <span className="text-amber-500 font-bold text-lg">★</span>
                <span className="font-bold text-base">{avgRating}</span>
                <span className="text-xs text-amber-600">({reviews.length}件)</span>
              </div>
            )}
          </div>

          {/* 住所・電話番号情報 */}
          <div className="flex flex-col gap-3 mb-6 p-4 bg-gray-50 rounded-xl border text-sm text-gray-700">
            {salon.address && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-gray-400">📍</span>
                <span>{salon.address}</span>
              </div>
            )}

            {salon.phone && (
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-200/60">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-gray-400">📞</span>
                  <span className="font-medium text-gray-800">{salon.phone}</span>
                </div>
                <a
                  href={`tel:${salon.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs transition border border-emerald-200"
                >
                  電話をかける
                </a>
              </div>
            )}
          </div>

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
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {menu.name}
                  </h3>
                  {menu.description && (
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed whitespace-pre-line">
                      {menu.description}
                    </p>
                  )}
                  <span className="inline-block text-xs text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
                    所要時間: {menu.duration}分
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-xl font-bold text-emerald-600 whitespace-nowrap">
                    ¥{menu.price?.toLocaleString()}
                  </span>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap">
                    予約する
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 口コミ（レビュー）セクション */}
      <section className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 flex justify-between items-center">
          <span>カスタマーの口コミ</span>
          <span className="text-xs text-gray-500 font-normal">{reviews.length}件の投稿</span>
        </h2>

        {/* 投稿フォーム表示制御 */}
        {session ? (
          <ReviewForm salonId={salon.id} menus={salon.menus || []} />
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center mb-8">
            <p className="text-sm text-emerald-800 font-medium mb-2">
              口コミを投稿するにはログインが必要です
            </p>
            <Link
              href="/login"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-md transition"
            >
              ログインして投稿する
            </Link>
          </div>
        )}

        {/* 口コミ一覧表示 */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">まだ口コミはありません。</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* 星評価（非ログイン時でも表示される） */}
                    <div className="text-amber-400 font-bold text-base">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    
                    {/* スマコン検証バッジ（将来用） */}
                    {review.is_verified_by_contract && (
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
                        ✓ 来店証明済み
                      </span>
                    )}
                  </div>
                  
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>

                {/* 利用コース・担当セラピストメタ情報 */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                  {review.menus?.name && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      コース: {review.menus.name}
                    </span>
                  )}
                  {review.therapist_name && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      担当: {review.therapist_name}
                    </span>
                  )}
                </div>

                {/* 会員/非会員でのコメント閲覧制御 */}
                {session ? (
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {review.comment}
                  </p>
                ) : (
                  <div className="relative overflow-hidden rounded-lg border border-slate-100 p-3 bg-slate-50/50 my-2">
                    {/* モザイク（ぼかし）テキストエリア：実際の本文を漏洩させないためダミーテキストを表示 */}
                    <p className="text-sm text-gray-400 select-none blur-[4px] pointer-events-none line-clamp-3 leading-relaxed">
                      素晴らしい施術で大変満足しました。店内の雰囲気も落ち着いていてリラックスできます。担当のスタッフの方も親切に対応してくださり、また利用したいと思います。
                    </p>

                    {/* オーバーレイ案内 */}
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-2">
                      <p className="text-xs font-semibold text-slate-700 mb-1.5 drop-shadow-sm">
                        🔒 口コミを読むにはログインが必要です
                      </p>
                      <Link
                        href="/login"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-md transition shadow-sm"
                      >
                        ログインする
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}