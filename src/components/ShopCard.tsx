import Link from 'next/link'
import { Clock, Phone, MapPin, CreditCard } from 'lucide-react'

export interface Therapist {
  id: string | number
  name: string
  image_url?: string | null
}

export interface Salon {
  id: string | number
  name: string
  description?: string | null
  image_url?: string | null
  price_info?: string | null
  card_ok?: boolean | null
  business_hours?: string | null
  reception_hours?: string | null
  phone?: string | null
  access?: string | null
  therapists?: Therapist[]
}

interface ShopCardProps {
  salon: Salon
  maxTherapists?: number
}

export default function ShopCard({ salon, maxTherapists = 6 }: ShopCardProps) {
  // 所属セラピストを最大件数（デフォルト6名）に制限
  const therapists = Array.isArray(salon.therapists)
    ? salon.therapists.slice(0, maxTherapists)
    : []

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition bg-white flex flex-col justify-between">
      <div>
        {/* 1. 店舗タイトル & 説明文 */}
        <Link href={`/salons/${salon.id}`} className="block group">
          <h2 className="text-lg font-bold mb-2 group-hover:text-amber-600 transition-colors">
            {salon.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {salon.description || '説明はありません'}
          </p>
        </Link>

        {/* 2. セラピスト横スライド表示エリア（縦長・3.3人見え） */}
        {therapists.length > 0 && (
          <div className="pt-2 pb-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 mb-2">
              所属セラピスト ({therapists.length}名)
            </p>
            <div className="flex overflow-x-auto gap-2 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
              {therapists.map((therapist) => (
                <Link
                  key={therapist.id}
                  href={`/therapists/${therapist.id}`}
                  className="flex-shrink-0 w-[28%] flex flex-col items-center snap-start group/item"
                >
                  <div className="w-full aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border border-gray-200 mb-1 relative">
                    {therapist.image_url ? (
                      <img
                        src={therapist.image_url}
                        alt={therapist.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                        No Img
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-700 font-medium text-center line-clamp-1 w-full">
                    {therapist.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3. 店舗詳細情報（左 1:1 サムネイル / 右 店舗データ） */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-12 gap-3 items-start">
          {/* 左側 1:1 サムネイル */}
          <div className="col-span-4 aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
            <Link href={`/salons/${salon.id}`}>
              <img
                src={
                  salon.image_url ||
                  `https://picsum.photos/seed/salon_${salon.id}/300/300`
                }
                alt={salon.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* 右側 店舗基本データ */}
          <div className="col-span-8 flex flex-col gap-1 text-[11px] text-gray-700">
            {/* 簡易プラン・料金情報 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-gray-900 text-xs">
                {salon.price_info || 'お問い合わせください'}
              </span>
              {salon.card_ok && (
                <span className="inline-flex items-center gap-0.5 bg-slate-100 text-slate-600 text-[9px] font-medium px-1.5 py-0.5 rounded border border-slate-200">
                  <CreditCard className="w-2.5 h-2.5 text-slate-500" />
                  カードOK
                </span>
              )}
            </div>

            {/* 営業時間 */}
            <div className="flex items-start gap-1 text-gray-600">
              <Clock className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span>{salon.business_hours || '要確認'}</span>
                {salon.reception_hours && (
                  <span className="text-gray-400 block text-[9px]">
                    ({salon.reception_hours})
                  </span>
                )}
              </div>
            </div>

            {/* 電話番号 */}
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-500 shrink-0" />
              {salon.phone ? (
                <a
                  href={`tel:${salon.phone.replace(/-/g, '')}`}
                  className="font-semibold text-gray-800 hover:text-amber-600 hover:underline"
                >
                  {salon.phone}
                </a>
              ) : (
                <span className="text-gray-400">非公開</span>
              )}
            </div>

            {/* 最寄り・アクセス */}
            <div className="flex items-start gap-1 text-[10px] text-gray-500">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-tight">
                {salon.access || '店舗にお問い合わせください'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}