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

  if (loading) return <div className="p-8">読み込み中...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-6">店舗掲載・申請承認一覧</h1>

      {salons.length === 0 ? (
        <p className="text-slate-500">現在、承認待ちの店舗はありません。</p>
      ) : (
        <div className="space-y-4">
          {salons.map((salon) => (
            <div key={salon.id} className="p-4 border rounded-lg bg-white shadow-sm flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{salon.name}</h2>
                <p className="text-sm text-slate-600">{salon.description}</p>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded mt-2 inline-block">
                  ステータス: {salon.status}
                </span>
              </div>
              <button
                onClick={() => handleApprove(salon.id)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-sm"
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