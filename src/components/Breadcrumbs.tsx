import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  // 全要素（TOPを含む）の階層リストを作成
  const allItems = [
    { label: 'TOP', href: '/' },
    ...items
  ]

  // Google検索用 JSON-LD 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://yourdomain.com${item.href}` : undefined
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="w-full bg-black border-b border-zinc-800 py-2 px-3">
        <ol className="flex items-center flex-wrap gap-1 text-[11px]">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1

            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />}
                {isLast || !item.href ? (
                  <span className="font-bold text-pink-400 line-clamp-1 max-w-[150px]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-zinc-400 hover:text-pink-500 hover:underline line-clamp-1 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}