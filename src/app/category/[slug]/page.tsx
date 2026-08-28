import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ShopCard from '@/components/ShopCard'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. スラグから対象のカテゴリー情報を取得（例: slug='shop', 'mansion', 'dispatch'）
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (categoryError || !category) {
    notFound()
  }

  // 2. salons テーブルから対象カテゴリーのサロンおよび所属セラピストを取得
  const { data: salons, error: salonsError } = await supabase
    .from('salons')
    .select(`
      *,
      therapists (
        id,
        name,
        image_url
      )
    `)
    .eq('category_id', category.id)

  if (salonsError) {
    console.error('サロン取得エラー:', salonsError)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {category.name || slug}のサロン一覧
      </h1>

      {salons && salons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <ShopCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          現在、このカテゴリーに登録されているサロンはありません。
        </p>
      )}
    </main>
  )
}