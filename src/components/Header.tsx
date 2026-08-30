import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          {/* トグルボタン */}
          <button type="button" className="flex flex-col justify-around w-6 h-6 p-0.5" aria-label="メニューを開く">
            <span className="w-full h-0.5 bg-gray-800 rounded-full"></span>
            <span className="w-full h-0.5 bg-gray-800 rounded-full"></span>
            <span className="w-full h-0.5 bg-gray-800 rounded-full"></span>
          </button>
          
          {/* サイトタイトル */}
          <h1 className="m-0 text-2xl font-black italic tracking-wider leading-none select-none">
            <Link href="/">埼玉メンエス情報館</Link>
          </h1>
        </div>

        {/* 機能アイコン群 */}
        <nav className="flex items-center gap-3">
          <Link href="/notice" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">🔔</span>
            <span>お知らせ</span>
          </Link>
          <Link href="/coupon" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">🎟️</span>
            <span>クーポン</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">🔍</span>
            <span>検索</span>
          </Link>
          <Link href="/mypage" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">👤</span>
            <span>マイページ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}