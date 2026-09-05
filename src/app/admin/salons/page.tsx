'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminSalonsPage() {
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchPendingSalons = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .eq('status', 'pending')

    if (!error && data) setSalons(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPendingSalons()
  }, [])

  const handleApprove = async (salonId: string) => {
    const { error } = await supabase
      .from('salons')
      .update({ status: 'approved' })
      .eq('id', salonId)

    if (error) {
      alert(`承認エラー: ${error.message}`)
    } else {
      alert('店舗を承認しました！')
      fetchPendingSalons()
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm font-medium">
        <span className="inline-block animate-pulse">データを読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto text-slate-100">
      <h1 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#e6007e] rounded-full shadow-[0_0_8px_rgba(230,0,126,0.8)]" />
        店舗掲載・申請承認一覧
      </h1>

      {salons.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-900/50 text-center text-neutral-400 text-sm">
          現在、承認待ちの店舗はありません。
        </div>
      ) : (
        <div className="space-y-4">
          {salons.map((salon) => (
            <div
              key={salon.id}
              className="p-5 border border-neutral-800 rounded-2xl bg-neutral-900 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-all"
            >
              <div className="space-y-1.5 min-w-0">
                <h2 className="font-bold text-base text-white truncate">{salon.name}</h2>
                <p className="text-xs text-neutral-400 line-clamp-2">{salon.description}</p>
                <div className="pt-1">
                  <span className="text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60 px-2.5 py-0.5 rounded-md inline-block">
                    ステータス: {salon.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleApprove(salon.id)}
                className="self-end sm:self-center shrink-0 px-5 py-2.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-700/60 font-bold rounded-xl text-xs shadow-[0_0_12px_rgba(16,185,129,0.2)] active:scale-95 transition-all"
              >
                許可（承認）する
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}