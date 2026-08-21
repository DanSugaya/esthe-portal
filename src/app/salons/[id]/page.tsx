import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SalonDetailPage({ params }: PageProps) {
  // Next.js 15 / App Router では params は Promise になります
  const { id } = await params
  const supabase = await createClient()

  // IDに一致するサロンと、紐づくメニューを取得
  const { data: salon, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      image_url,
      description,
      menus (
        id,
        title,
        duration,
        price
      )
    `)
    .eq('id', id)
    .single()

  // 該当サロンが存在しない場合は404ページを表示
  if (error || !salon) {
    notFound()
  }

  return (
    
      {/* 戻るボタン */}
      
        ← サロン一覧に戻る
      

      {/* メインカード */}
      
        {salon.image_url ? (
          
            
          
        ) : (
          
            No Image
          
        )}

        
          
            {salon.name}
          
          
            {salon.description}
          
        
      

      {/* メニュー一覧セクション */}
      
        
          施術メニュー一覧
        

        {!salon.menus || salon.menus.length === 0 ? (
          現在提供中のメニューはありません。
        ) : (
          
            {salon.menus.map((menu: any) => (
              
                
                  
                    {menu.title}
                  
                  
                    所要時間: {menu.duration}分
                  
                

                
                  
                    ¥{menu.price?.toLocaleString()}
                  
                  
                    予約する
                  
                
              
            ))}
          
        )}
      
    
  )
}