import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SalonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. まずサロン本体のデータだけを単純に取得してみる
  const { data: salon, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', id)
    .single()

  // エラーやデータがない場合は詳細を画面に出す
  if (error || !salon) {
    return (
      <div className="p-8 text-red-500">
        <h1 className="text-xl font-bold">サロンデータ取得エラー</h1>
        <p>指定されたID: {id}</p>
        <p>エラーメッセージ: {error?.message || '該当サロンがありません'}</p>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        &larr; サロン一覧に戻る
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">{salon.name}</h1>
      <p className="text-gray-600">{salon.description}</p>
    </main>
  )
}