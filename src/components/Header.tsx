import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-neutral-950 border-b border-neutral-800 font-sans sticky top-0 z-50">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          {/* トグルボタン */}
          <button 
            type="button" 
            className="flex flex-col justify-around w-6 h-6 p-0.5 group cursor-pointer" 
            aria-label="メニューを開く"
          >
            <span className="w-full h-0.5 bg-neutral-300 rounded-full group-hover:bg-[#e6007e] transition-colors"></span>
            <span className="w-full h-0.5 bg-neutral-300 rounded-full group-hover:bg-[#e6007e] transition-colors"></span>
            <span className="w-full h-0.5 bg-neutral-300 rounded-full group-hover:bg-[#e6007e] transition-colors"></span>
          </button>
          
          {/* サイトタイトル (FANZA風インパクトロゴ) */}
          <h1 className="m-0 text-xl font-black italic tracking-wider leading-none select-none">
            <Link 
              href="/" 
              className="inline-block bg-gradient-to-r from-[#e6007e] via-[#ff007f] to-[#ff66b8] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(230,0,126,0.7)] hover:scale-105 transition-transform duration-200"
            >
              埼玉メンエス情報館
            </Link>
          </h1>
        </div>

        {/* 機能アイコン群 */}
        <nav className="flex items-center gap-3">
          <Link 
            href="/notice" 
            className="flex flex-col items-center text-neutral-300 hover:text-[#ff2a9d] no-underline text-[10px] font-bold transition-colors group"
          >
            <span className="text-base mb-0.5 group-hover:scale-110 transition-transform">🔔</span>
            <span>お知らせ</span>
          </Link>
          <Link 
            href="/coupon" 
            className="flex flex-col items-center text-neutral-300 hover:text-[#ff2a9d] no-underline text-[10px] font-bold transition-colors group"
          >
            <span className="text-base mb-0.5 group-hover:scale-110 transition-transform">🎟️</span>
            <span>クーポン</span>
          </Link>
          <Link 
            href="/search" 
            className="flex flex-col items-center text-neutral-300 hover:text-[#ff2a9d] no-underline text-[10px] font-bold transition-colors group"
          >
            <span className="text-base mb-0.5 group-hover:scale-110 transition-transform">🔍</span>
            <span>検索</span>
          </Link>
          <Link 
            href="/mypage" 
            className="flex flex-col items-center text-neutral-300 hover:text-[#ff2a9d] no-underline text-[10px] font-bold transition-colors group"
          >
            <span className="text-base mb-0.5 group-hover:scale-110 transition-transform">👤</span>
            <span>マイページ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}