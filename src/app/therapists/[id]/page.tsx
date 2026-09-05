import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TherapistDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const targetId = isNaN(Number(id)) ? id : Number(id)

  // 指定されたカラム構造（id, salon_id, name, age, image_url）に合わせて取得
  const { data: therapist, error } = await supabase
    .from('therapists')
    .select(`
      id,
      salon_id,
      name,
      age,
      image_url,
      salons (
        id,
        name,
        areas (
          area_group,
          city,
          slug
        )
      )
    `)
    .eq('id', targetId)
    .single()

  // モック表示・フォールバック用データ
  const therapistData = therapist || {
    id: targetId,
    salon_id: 44069,
    name: '花井かりな',
    age: 27,
    image_url: 'https://img.estama.jp/shop_data/00000044069/cast/main/357x556/achfv_20260830115610.jpg?f=webp'
  }

  const salonData = Array.isArray(therapist?.salons) ? therapist.salons[0] : therapist?.salons
  const areaData = Array.isArray(salonData?.areas) ? salonData.areas[0] : salonData?.areas

  const breadcrumbItems = [
    { label: areaData?.area_group || '大宮エリア', href: '#' },
    { label: salonData?.name || '店舗トップ', href: therapistData.salon_id ? `/salons/${therapistData.salon_id}` : '#' },
    { label: therapistData.name }
  ]

  // 出勤スケジュール（モック）
  const scheduleDates = [
    { date: '9/5(土)', time: '12:00～20:00', active: true },
    { date: '9/6(日)', time: '休み', active: false },
    { date: '9/7(月)', time: '休み', active: false },
    { date: '9/8(火)', time: '10:00～19:00', active: true },
    { date: '9/9(水)', time: '休み', active: false },
    { date: '9/10(木)', time: '休み', active: false },
    { date: '9/11(金)', time: '12:00～20:00', active: true }
  ]

  return (
    <div className="bg-zinc-950 min-h-screen pb-24 text-zinc-100">
      {/* パンくずリスト */}
      <Breadcrumbs items={breadcrumbItems} />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* セラピスト メインカード */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl p-5 md:p-8 space-y-6">
          
          {/* ヘッダー: 名前・年齢 */}
          <div className="border-b border-zinc-800 pb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {therapistData.name} <span className="text-lg font-normal text-zinc-400">({therapistData.age})</span>
            </h1>
          </div>

          {/* セラピストメイン画像 (image_url) */}
          <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner">
            <img
              src={therapistData.image_url}
              alt={`${therapistData.name}の写真`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* アクションボタン群 */}
          <div className="space-y-3 pt-2">
            <a
              href="#"
              className="block w-full py-3.5 text-center font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition shadow-lg shadow-pink-950/50"
            >
              {therapistData.name} でネット予約する
            </a>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-xl border border-zinc-700 transition flex items-center justify-center gap-2">
                <span>⚡ 今すぐ行けるか確認する</span>
              </button>
              <button className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-xl border border-zinc-700 transition flex items-center justify-center gap-2">
                <span>✉️ 出勤予定をメールで受取</span>
              </button>
            </div>
          </div>
        </section>

        {/* 出勤スケジュール概要 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
            <h2 className="text-xl font-bold text-white tracking-wide">出勤スケジュール</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {scheduleDates.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  item.active
                    ? 'bg-zinc-950 border-pink-500/40 text-zinc-100'
                    : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600'
                }`}
              >
                <p className="text-xs font-bold">{item.date}</p>
                <p className={`text-[11px] font-semibold ${item.active ? 'text-pink-400' : 'text-zinc-600'}`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 口コミセクション */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
            <h2 className="text-xl font-bold text-white tracking-wide">口コミ</h2>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-6 text-center space-y-3">
            <p className="text-sm text-zinc-400">
              応援口コミ募集中！{therapistData.name}さんは、いかがでしたか？
            </p>
            <p className="text-xs text-zinc-500">※口コミを投稿するには会員ログインが必要です。</p>
            <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg border border-zinc-700 transition">
              ログインして口コミを書く
            </button>
          </div>
        </section>

      </main>

      {/* モバイル固定ボトムバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-3 flex gap-2 z-50 sm:hidden">
        <a
          href="#"
          className="flex-1 py-2.5 bg-pink-600 text-white rounded-lg text-center font-bold text-sm shadow-md shadow-pink-950/50"
        >
          ネット予約する
        </a>
      </div>
    </div>
  )
}