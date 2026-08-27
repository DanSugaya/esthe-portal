export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 font-sans">
      {/* 1段目 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* トグルボタン */}
          <button type="button" className="flex flex-col justify-around w-6 h-6 p-0.5" aria-label="メニューを開く">
            <span className="w-full h-0.5 bg-gray-800 rounded-full"></span>
            <span className="w-full h-0.5 bg-gray-800 rounded-full"></span>
            <span className="w-full h-0.5 bg-gray-800 rounded-full"></span>
          </button>
          {/* サイトタイトル */}
          <h1 className="m-0 text-lg font-bold text-gray-800 leading-none">
            <a href="/">埼玉メンズエステ情報館</a>
          </h1>
        </div>

        {/* 機能アイコン群 */}
        <nav className="flex items-center gap-3">
          <a href="/notice" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">🔔</span>
            <span>お知らせ</span>
          </a>
          <a href="/coupon" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">🎟️</span>
            <span>クーポン</span>
          </a>
          <a href="/search" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">🔍</span>
            <span>検索</span>
          </a>
          <a href="/mypage" className="flex flex-col items-center text-gray-800 no-underline text-[10px]">
            <span className="text-base mb-0.5">👤</span>
            <span>マイページ</span>
          </a>
        </nav>
      </div>

      {/* 2段目 */}
      <div className="px-3 py-2 bg-gray-50">
        <div className="flex w-full gap-2">
          <a href="/login" className="flex-1 py-1.5 text-xs font-bold text-center text-blue-600 bg-white border border-blue-600 rounded">
            ログイン
          </a>
          <a href="/register" className="flex-1 py-1.5 text-xs font-bold text-center text-white bg-blue-600 border border-blue-600 rounded">
            新規会員登録
          </a>
        </div>
      </div>
    </header>
  );
}