'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import {
  Store,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  EyeOff,
  Plus,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'

export default function AdminSalonsMasterPage() {
  const router = useRouter()
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  // 全サロンデータの取得
  const fetchAllSalons = async () => {
    setLoading(true)

    // 全カラムまたは管理に必要な主要カラムを取得
    const { data, error } = await supabase
      .from('salons')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('全サロン取得エラー:', error.message)
    } else if (data) {
      setSalons(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAllSalons()
  }, [])

  // ステータス更新処理（承認・非表示化などのクイック切り替え）
  const handleStatusChange = async (salonId: string | number, newStatus: string) => {
    const { error } = await supabase
      .from('salons')
      .update({ status: newStatus })
      .eq('id', salonId)

    if (error) {
      alert(`ステータス更新エラー: ${error.message}`)
    } else {
      fetchAllSalons()
    }
  }

  // 店舗の削除処理
  const handleDelete = async (salonId: string | number, salonName: string) => {
    if (!confirm(`「${salonName}」を本当に削除しますか？\nこの操作は取り消せません。`)) {
      return
    }

    const { error } = await supabase.from('salons').delete().eq('id', salonId)

    if (error) {
      alert(`削除エラー: ${error.message}`)
    } else {
      alert('店舗を削除しました。')
      fetchAllSalons()
    }
  }

  // 検索・絞り込みフィルタリング
  const filteredSalons = salons.filter((salon) => {
    const matchesQuery = salon.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || salon.status === statusFilter
    return matchesQuery && matchesStatus
  })

  // ステータスバッジの描画
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> 公開中 (approved)
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> 承認待ち (pending)
          </span>
        )
      case 'suspended':
      case 'hidden':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 px-2.5 py-0.5 rounded-full">
            <EyeOff className="w-3 h-3" /> 非公開
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-0.5 rounded-full">
            {status || '未設定'}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-zinc-400 text-sm font-medium">
        <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3" />
        <span className="text-zinc-400 animate-pulse">全店舗マスターデータを読み込み中...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8 text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ナビゲーション & ヘッダー */}
        <div className="space-y-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> ダッシュボードへ戻る
          </Link>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-7 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                  <Store className="w-6 h-6 text-pink-500" />
                  店舗マスター管理
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  登録されている全店舗データの検索、ステータス変更、直接編集、削除を行います
                </p>
              </div>
            </div>

            <Link
              href="/admin/salons/new"
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-950/60 active:scale-95 transition-all flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> 新規店舗登録
            </Link>
          </div>
        </div>

        {/* コントロールエリア（検索・絞り込み） */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
          {/* キーワード検索 */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="店舗名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* ステータス絞り込み */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
            >
              <option value="all">すべてのステータス ({salons.length})</option>
              <option value="approved">公開中 (approved)</option>
              <option value="pending">承認待ち (pending)</option>
              <option value="hidden">非公開 (hidden)</option>
            </select>
          </div>
        </div>

        {/* マスターテーブル一覧 */}
        <div className="border border-zinc-800/90 rounded-2xl bg-zinc-900/90 shadow-lg overflow-hidden">
          {filteredSalons.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-400">条件に該当する店舗が見つかりません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">店舗名</th>
                    <th className="p-4">ステータス</th>
                    <th className="p-4">登録日</th>
                    <th className="p-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredSalons.map((salon) => (
                    <tr
                      key={salon.id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="p-4 font-mono text-zinc-500">{salon.id}</td>
                      <td className="p-4 font-bold text-white group-hover:text-pink-400 transition-colors">
                        {salon.name}
                      </td>
                      <td className="p-4">{renderStatusBadge(salon.status)}</td>
                      <td className="p-4 text-zinc-500">
                        {salon.created_at
                          ? new Date(salon.created_at).toLocaleDateString('ja-JP')
                          : '-'}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {/* ステータス切り替えメニュー */}
                        {salon.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(salon.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            公開にする
                          </button>
                        )}
                        {salon.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(salon.id, 'hidden')}
                            className="px-2.5 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            非公開にする
                          </button>
                        )}

                        {/* 詳細編集へ */}
                        <Link
                          href={`/admin/salons/${salon.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-950/50 text-pink-400 border border-pink-800/50 hover:bg-pink-900/50 rounded-lg text-[10px] font-bold transition-all"
                        >
                          <Edit className="w-3 h-3" /> 編集
                        </Link>

                        {/* 削除 */}
                        <button
                          onClick={() => handleDelete(salon.id, salon.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/50 text-rose-400 border border-rose-800/50 hover:bg-rose-900/50 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> 削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}