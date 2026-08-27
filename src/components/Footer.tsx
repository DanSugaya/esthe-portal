import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* ブランド情報 */}
          <div>
            <Link href="/" className="text-lg font-bold text-white hover:opacity-80 transition">
              埼玉メンズエステ情報館
            </Link>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              自分にぴったりのエステサロンが見つかるポータルサイト
            </p>
          </div>

          {/* 一般ユーザー向けメニュー */}
          <div>
            <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">
              サービス
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  サロンを探す
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition">
                  ログイン・会員登録
                </Link>
              </li>
            </ul>
          </div>

          {/* 店舗・事業者様向けメニュー */}
          <div>
            <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">
              サロンオーナー様へ
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/owner/auth" className="text-emerald-400 hover:underline font-medium">
                  掲載のお申し込み・店舗ログイン
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Esthe Portal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}