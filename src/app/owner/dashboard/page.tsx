'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Bell,
  Search,
  ChevronDown,
  Plus,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Store,
  Edit,
  Trash2,
  Save,
  UtensilsCrossed,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'salon' | 'menus'>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ステートデータ
  const [salon, setSalon] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);

  // 店舗編集用フォームステート
  const [salonForm, setSalonForm] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    header_image_url: '',
  });

  // メニューモーダル用ステート
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 60,
  });

  // 1. 店舗データおよびメニューデータの初期取得
  useEffect(() => {
    fetchSalonAndMenus();
  }, []);

  const fetchSalonAndMenus = async () => {
    try {
      setLoading(true);
      // ログインユーザー取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 店舗情報取得
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (salonError) throw salonError;

      if (salonData) {
        setSalon(salonData);
        setSalonForm({
          name: salonData.name || '',
          description: salonData.description || '',
          phone: salonData.phone || '',
          address: salonData.address || '',
          header_image_url: salonData.header_image_url || '',
        });

        // メニュー一覧取得
        const { data: menuData, error: menuError } = await supabase
          .from('menus')
          .select('*')
          .eq('salon_id', salonData.id)
          .order('created_at', { ascending: false });

        if (menuError) throw menuError;
        setMenus(menuData || []);
      }
    } catch (err: any) {
      alert(`データ取得エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 店舗ヘッダー画像のアップロード処理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `headers/${salon.id}-${Math.random()}.${fileExt}`;

      // Supabase Storage にアップロード
      const { error: uploadError } = await supabase.storage
        .from('salons')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 公開用URLを取得
      const { data } = supabase.storage.from('salons').getPublicUrl(filePath);

      setSalonForm((prev) => ({ ...prev, header_image_url: data.publicUrl }));
      alert('画像をアップロードしました。');
    } catch (err: any) {
      alert(`画像アップロードエラー: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // 2. 店舗情報の保存（salons 更新）
  const handleSaveSalon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon?.id) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('salons')
        .update({
          name: salonForm.name,
          description: salonForm.description,
          phone: salonForm.phone,
          address: salonForm.address,
          header_image_url: salonForm.header_image_url,
        })
        .eq('id', salon.id);

      if (error) throw error;
      alert('店舗情報を更新しました。');
      fetchSalonAndMenus();
    } catch (err: any) {
      alert(`更新エラー: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 3. メニューモーダルの開閉
  const openMenuModal = (menu: any = null) => {
    if (menu) {
      setEditingMenu(menu);
      setMenuForm({
        name: menu.name || '',
        description: menu.description || '',
        price: menu.price || 0,
        duration: menu.duration || 60,
      });
    } else {
      setEditingMenu(null);
      setMenuForm({ name: '', description: '', price: 0, duration: 60 });
    }
    setIsMenuModalOpen(true);
  };

  // 4. メニューの保存（新規追加 または 更新）
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon?.id) return;
    setSaving(true);

    try {
      if (editingMenu) {
        // 更新
        const { error } = await supabase
          .from('menus')
          .update({
            name: menuForm.name,
            description: menuForm.description,
            price: Number(menuForm.price),
            duration: Number(menuForm.duration),
          })
          .eq('id', editingMenu.id);

        if (error) throw error;
        alert('メニューを更新しました。');
      } else {
        // 新規作成
        const { error } = await supabase
          .from('menus')
          .insert({
            salon_id: salon.id,
            name: menuForm.name,
            description: menuForm.description,
            price: Number(menuForm.price),
            duration: Number(menuForm.duration),
          });

        if (error) throw error;
        alert('メニューを追加しました。');
      }

      setIsMenuModalOpen(false);
      fetchSalonAndMenus();
    } catch (err: any) {
      alert(`保存エラー: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 5. メニューの削除
  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('このメニューを削除してもよろしいですか？')) return;

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', menuId);

      if (error) throw error;
      alert('メニューを削除しました。');
      fetchSalonAndMenus();
    } catch (err: any) {
      alert(`削除エラー: ${err.message}`);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/owner/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* サイドバー */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base">{salon?.name || '店舗ダッシュボード'}</h1>
            <p className="text-xs text-slate-400">店舗管理ポータル</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            ダッシュボード
          </button>
          <button
            onClick={() => setActiveTab('salon')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'salon'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="h-5 w-5" />
            店舗情報編集
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'menus'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="h-5 w-5" />
            メニュー管理
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ヘッダー */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              ステータス: {salon?.status || '未設定'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200">
              {salon?.name?.[0] || 'S'}
            </div>
            <span className="text-sm font-semibold text-slate-800">{salon?.name || '未登録'}</span>
          </div>
        </header>

        {/* タブコンテンツ */}
        <main className="p-8 space-y-8 flex-1">
          {/* TAB 1: 概要ダッシュボード */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">ダッシュボード概要</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">登録メニュー数</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{menus.length}件</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">店舗ステータス</p>
                  <p className="text-xl font-bold text-slate-900 mt-2 capitalize">{salon?.status || '未申請'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 店舗情報編集（salons） */}
          {activeTab === 'salon' && (
            <div className="max-w-2xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">店舗情報の編集</h2>
                <p className="text-xs text-slate-500 mt-1">お客様に公開される店舗の基本情報を変更します。</p>
              </div>

              <form onSubmit={handleSaveSalon} className="space-y-4">
                {/* 店舗イメージヘッダープレビュー & アップロード */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">店舗イメージヘッダー</label>
                  <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center group">
                    {salonForm.header_image_url ? (
                      <img
                        src={salonForm.header_image_url}
                        alt="店舗ヘッダー"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <ImageIcon className="h-8 w-8 mb-1" />
                        <span className="text-xs">画像が設定されていません</span>
                      </div>
                    )}

                    {/* アップロード用ボタンオーバーレイ */}
                    <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold gap-2">
                      <Upload className="h-4 w-4" />
                      {uploading ? 'アップロード中...' : '画像を変換・変更'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">サロン名</label>
                  <input
                    type="text"
                    required
                    value={salonForm.name}
                    onChange={(e) => setSalonForm({ ...salonForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">説明文</label>
                  <textarea
                    rows={4}
                    value={salonForm.description}
                    onChange={(e) => setSalonForm({ ...salonForm, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="店舗のコンセプトやアピールポイント"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">電話番号</label>
                    <input
                      type="text"
                      value={salonForm.phone}
                      onChange={(e) => setSalonForm({ ...salonForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="03-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">住所</label>
                    <input
                      type="text"
                      value={salonForm.address}
                      onChange={(e) => setSalonForm({ ...salonForm, address: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="東京都港区..."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? '保存中...' : '店舗情報を保存'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: メニュー管理（menus） */}
          {activeTab === 'menus' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">提供メニューの管理</h2>
                  <p className="text-xs text-slate-500 mt-1">店舗で提供する施術やプランを管理します。</p>
                </div>
                <button
                  onClick={() => openMenuModal()}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  新規メニュー追加
                </button>
              </div>

              {/* メニューテーブル */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">メニュー名</th>
                      <th className="px-6 py-3">概要</th>
                      <th className="px-6 py-3">料金</th>
                      <th className="px-6 py-3">所要時間</th>
                      <th className="px-6 py-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {menus.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                          登録されているメニューがありません。
                        </td>
                      </tr>
                    ) : (
                      menus.map((menu) => (
                        <tr key={menu.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900">{menu.name}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                            {menu.description || '-'}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">
                            ¥{Number(menu.price).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{menu.duration || 0} 分</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => openMenuModal(menu)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(menu.id)}
                              className="p-1.5 hover:bg-rose-50 rounded text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* メニュー編集・新規追加モーダル */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              {editingMenu ? 'メニュー編集' : '新規メニュー登録'}
            </h3>

            <form onSubmit={handleSaveMenu} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">メニュー名</label>
                <input
                  type="text"
                  required
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="カット + カラー"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">説明</label>
                <textarea
                  rows={3}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="施術内容の詳細"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">料金 (円)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">所要時間 (分)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={menuForm.duration}
                    onChange={(e) => setMenuForm({ ...menuForm, duration: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? '保存中...' : '保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}