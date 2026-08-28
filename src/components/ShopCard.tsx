import Link from 'next/link'

// 型定義
export interface Therapist {
  id: string | number
  name: string
  image_url?: string | null
}

export interface Salon {
  id: string | number
  name: string
  description?: string | null
  therapists?: Therapist[]
}

interface ShopCardProps {
  salon: Salon
  maxTherapists?: number
}

export default function ShopCard({ salon, maxTherapists = 6 }: ShopCardProps) {
  // セラピスト情報を指定件数までに制限
  const therapists = Array.isArray(salon.therapists)
    ? salon.therapists.slice(0, maxTherapists)
    : []

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition bg-white flex flex-col justify-between">
      <div>
        <Link href={`/salons/${salon.id}`} className="block group">
          <h2 className="text-lg font-bold mb-2 group-hover:text-amber-600 transition-colors">
            {salon.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {salon.description || '説明はありません'}
          </p>
        </Link>
      </div>

      {/* セラピスト横スライド表示エリア（縦長・3.3人見え） */}
      {therapists.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
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
                {/* 縦長アスペクト比（3:4）の画像枠 */}
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
    </div>
  )
}