import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SalonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const targetId = isNaN(Number(id)) ? id : Number(id)

  // DBからのデータ取得（therapistsリレーションを追加）
const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      id,
      category_id,
      name,
      catchphrase,
      image_url,
      is_published,
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
      ),
      therapists (
        id,
        name,
        age,
        image_url
      )
    `)
    .eq('id', targetId)
    .single()

  // 非公開店舗やエラー時は404へリダイレクト
  if (error || !salon || salon.is_published === false) {
    console.error('サロン取得エラー:', JSON.stringify(error, null, 2))
    notFound()
  }

  const areaData = Array.isArray(salon.areas) ? salon.areas[0] : salon.areas

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

  // DBから取得したセラピスト一覧（非アクティブを除外する場合はfilterを適用）
  const therapists = salon.therapists || []

  return (
    <div className="bg-zinc-950 min-h-screen pb-24 text-zinc-100">
      {/* 1. パンくずリスト */}
      <Breadcrumbs items={breadcrumbItems} />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

        {/* 2. メインビジュアル & 店舗ヘッダー */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          {/* カバー画像 (salon.image_url を使用) */}
          <div className="relative h-48 md:h-64 w-full bg-zinc-800">
            <img
              src={salon.image_url || "/images/no-image.png"}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          </div>

          <div className="p-6 md:p-8 space-y-4 relative -mt-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-pink-950/80 border border-pink-500/30 text-pink-400 font-semibold">
                {areaData?.city || 'エリア情報なし'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                マンション(個室)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                日本人
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                {salon.name}
              </h1>
              {/* キャッチコピー (salon.catchphrase を使用) */}
              {salon.catchphrase && (
                <p className="text-sm md:text-base text-pink-300/90 font-medium pt-1">
                  {salon.catchphrase}
                </p>
              )}
            </div>

            {/* 基本スペック */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm text-zinc-300 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="text-pink-400 font-bold">予算:</span> 75分 / 15,000円〜
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400 font-bold">時間:</span> 10:00～LAST
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400 font-bold">最寄:</span> {areaData?.city || '最寄駅'}
              </div>
            </div>

            {/* 予約アクションボタン */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <a
                href="tel:090-3440-1196"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition border border-zinc-700"
              >
                <span>📞 電話で予約</span>
              </a>
              <a
                href="https://lin.ee/YoVvvTo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition shadow-lg shadow-pink-950/50"
              >
                <span>💬 LINE予約</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. HOT MESSAGE（お得情報） */}
        <section className="bg-gradient-to-r from-pink-950/40 to-zinc-900 border border-pink-500/30 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
            <span className="text-xs font-bold text-pink-400 tracking-wider uppercase">HOT MESSAGE</span>
            <span className="text-xs text-zinc-400">最新情報</span>
          </div>
          <h3 className="text-lg font-bold text-white">ご新規様1000円引き‼︎</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            ご新規様のご利用時に90分以上のコースを1000円割引させて頂きます。お電話・予約時にてお申し付け下さいませ。
          </p>
        </section>

        {/* 4. 提供メニュー一覧 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              施術メニュー
            </h2>
          </div>

          {salon.menus && salon.menus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salon.menus.map((menu: any) => (
                <div
                  key={menu.id}
                  className="p-5 border border-zinc-800/80 rounded-xl bg-zinc-950/60 hover:border-pink-500/40 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-zinc-100 text-base leading-snug">
                        {menu.name}
                      </h3>
                      <span className="font-extrabold text-pink-400 text-base whitespace-nowrap bg-pink-950/40 px-2.5 py-1 rounded-md border border-pink-500/20">
                        ¥{Number(menu.price).toLocaleString()}
                      </span>
                    </div>

                    {menu.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {menu.description}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-zinc-500 font-medium pt-2 border-t border-zinc-800/50 flex items-center justify-between">
                    <span>所要時間</span>
                    <span className="text-zinc-300">約{menu.duration}分</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-4 text-center">
              現在表示できるメニューはありません。
            </p>
          )}
        </section>

        {/* 5. 在籍セラピスト (DBから動的取得) */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
              <h2 className="text-xl font-bold text-white tracking-wide">セラピスト</h2>
            </div>
            {therapists.length > 0 && (
              <span className="text-xs text-pink-400 hover:underline cursor-pointer">
                全員を見る ({therapists.length}名) →
              </span>
            )}
          </div>

          {therapists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {therapists.map((therapist: any) => (
                <a
                  key={therapist.id}
                  href={`/therapists/${therapist.id}`}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group block hover:border-pink-500/40 transition-colors"
                >
                  <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden">
                    <img
                      src={therapist.image_url || "/images/no-avatar.png"}
                      alt={therapist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-bold text-sm text-white truncate">
                      {therapist.name} {therapist.age ? `(${therapist.age})` : ''}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-4 text-center">
              現在表示できるセラピスト情報はありません。
            </p>
          )}
        </section>

        {/* 6. 店舗基本情報 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
            <h2 className="text-xl font-bold text-white tracking-wide">店舗情報</h2>
          </div>

          <div className="space-y-4 text-sm divide-y divide-zinc-800/60">
            <div className="grid grid-cols-3 gap-2 pt-3">
              <span className="text-zinc-400 font-semibold">住所</span>
              <span className="col-span-2 text-zinc-200">〒330-0802 埼玉県さいたま市大宮区宮町1丁目34</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3">
              <span className="text-zinc-400 font-semibold">営業時間</span>
              <span className="col-span-2 text-zinc-200">10:00～LAST（定休日: 年中無休）</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3">
              <span className="text-zinc-400 font-semibold">支払い方法</span>
              <span className="col-span-2 text-zinc-200">クレジットカード（Visa, Mastercard, JCB他）、PayPay</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3">
              <span className="text-zinc-400 font-semibold">特徴</span>
              <span className="col-span-2 text-zinc-200">日本人セラピストのみ、完全予約制、完全個室</span>
            </div>
          </div>
        </section>

      </main>

      {/* 7. モバイル固定ボトムバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-3 flex gap-2 z-50 sm:hidden">
        <a
          href="tel:090-3440-1196"
          className="flex-1 py-2.5 bg-zinc-800 text-white rounded-lg text-center font-bold text-sm border border-zinc-700"
        >
          電話予約
        </a>
        <a
          href="https://lin.ee/YoVvvTo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-pink-600 text-white rounded-lg text-center font-bold text-sm shadow-md shadow-pink-950/50"
        >
          LINE予約
        </a>
      </div>
    </div>
  )
}