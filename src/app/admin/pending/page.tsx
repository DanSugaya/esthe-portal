'use client'

import { useEffect, useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { CheckCircle2, Building2, Clock, MapPin, AlertCircle } from 'lucide-react'

export default function AdminSalonsPage() {
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  const fetchPendingSalons = async () => {
    setLoading(true)

    // description を除外して安全にカラム取得
    const { data, error } = await supabase
      .from('salons')
      .select('id, name, status, address, created_at')
      .eq('status', 'pending')

    if (error) {
      console.error('承認待ちサロン一覧の取得エラー:', error.message)
    } else if (data) {
      setSalons(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchPendingSalons()
  }, [])

  const handleApprove = async (salonId: string | number) => {
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-zinc-400 text-sm font-medium">
        <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3" />
        <span className="text-zinc-400 animate-pulse">承認待ちデータを読み込み中...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ヘッダーエリア */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="w-2 h-7 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                店舗掲載・申請承認
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                オーナーから申請された新規店舗情報の確認と承認を行います
              </p>
            </div>
          </div>
        </div>

        {/* 一覧エリア */}
        {salons.length === 0 ? (
          <div className="p-12 border border-zinc-800/80 rounded-2xl bg-zinc-900/40 text-center space-y-3">
            <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto text-zinc-500 border border-zinc-700/50">
              <CheckCircle2 className="w-6 h-6 text-pink-500/70" />
            </div>
            <p className="text-sm font-bold text-zinc-300">承認待ちの店舗はありません</p>
            <p className="text-xs text-zinc-500">現在、新しい掲載申請リクエストは届いていません。</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-pink-500" />
                承認待ち: <span className="text-pink-400 font-extrabold">{salons.length}</span> 件
              </span>
            </div>

            {salons.map((salon) => (
              <div
                key={salon.id}
                className="p-5 border border-zinc-800/90 rounded-2xl bg-zinc-900/90 shadow-lg hover:border-pink-500/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      承認待ち ({salon.status})
                    </span>
                    {salon.created_at && (
                      <span className="text-[10px] text-zinc-500">
                        申請日: {new Date(salon.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-base text-white group-hover:text-pink-400 transition-colors flex items-center gap-2 truncate">
                    <Building2 className="w-4 h-4 text-pink-500/70 shrink-0" />
                    <span className="truncate">{salon.name}</span>
                  </h2>

                  {salon.address && (
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {salon.address}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleApprove(salon.id)}
                  className="self-end sm:self-center shrink-0 px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-950/60 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  許可（承認）する
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}