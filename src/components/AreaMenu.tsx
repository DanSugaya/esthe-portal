import { createClient } from '@/lib/supabase/server';
import AreaSlider from './AreaSlider';

export default async function AreaMenu() {
  let locations: any[] | null = null;
  let fetchError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('areas')
      .select(`
        id,
        city,
        area_group,
        parent_area,
        slug,
        salons ( id )
      `);

    if (error) {
      fetchError = error.message;
    } else {
      locations = data;
    }
  } catch (err: any) {
    fetchError = err?.message || 'Supabase接続エラー';
  }

  if (fetchError) {
    return (
      <div className="p-3 text-[11px] text-pink-400 bg-neutral-900 text-center border-b border-neutral-800">
        エリアデータ取得エラー: {fetchError}
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="p-3 text-[11px] text-neutral-500 text-center border-b border-neutral-800">
        エリアデータが登録されていません (0件)
      </div>
    );
  }

  return (
    <section className="w-full py-3 bg-neutral-950 border-b border-neutral-800">
      {/* 見出しエリア */}
      <div className="px-3 mb-2.5 flex justify-between items-center">
        <h2 className="text-xs font-black text-white flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-[#e6007e] rounded-full shadow-[0_0_6px_rgba(230,0,126,0.8)]" />
          エリアから探す
        </h2>
      </div>

      {/* Swiperスライダー（クライアントコンポーネント） */}
      <AreaSlider locations={locations} />
    </section>
  );
}