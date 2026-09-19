<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>メンズエステ ポータル - TOP</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <style>
    :root {
      --color-primary: #1B2F8F;
      --color-primary-dark: #12206A;
      --color-primary-light: #E8ECFA;
      --color-accent-promo: #E0407F;
      --color-accent-like: #D93025;
      --color-accent-star: #F5A623;
      --color-accent-point: #FFE234;
      --color-success: #2E9E5B;
      --color-text: #222222;
      --color-text-sub: #888888;
      --color-border: #E0E0E0;
      --color-bg: #FFFFFF;
      --color-bg-sub: #F4F4F4;
      --color-overlay: rgba(18, 32, 106, 0.85);

      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 24px;
      --space-6: 32px;

      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --radius-pill: 999px;

      --header-h: 56px;
      --tabbar-h: 64px;
    }

    body {
      font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", system-ui, sans-serif;
      color: var(--color-text);
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    /* Hide Scrollbars while keeping functionality */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Text Ellipsis Rules */
    .ellipsis-1 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ellipsis-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Tab bar active indicator */
    .tab-active {
      color: var(--color-primary) !important;
      font-weight: 700;
    }
    
    .tab-active svg {
      stroke: var(--color-primary);
    }

    /* Section Divider Line (Magapoke signature 4px line) */
    .section-divider {
      height: 4px;
      background-color: var(--color-primary);
      width: 100%;
    }

    /* Touch active state */
    .touch-effect:active {
      opacity: 0.7;
      transform: scale(0.98);
      transition: all 100ms ease-out;
    }

    /* Tab Switch Line */
    .rank-tab-btn.active {
      color: var(--color-primary);
      font-weight: 700;
      border-bottom: 3px solid var(--color-primary);
    }
  </style>
</head>
<body class="flex justify-center items-start min-h-screen">

  <!-- Mobile Shell Wrapper (Max width 720px centered for desktop testing) -->
  <div id="app-container" class="w-full max-w-[720px] bg-white min-h-screen relative pb-[80px] shadow-xl flex flex-col">

    <!-- 4.1 App Bar (Fixed Header) -->
    <header class="sticky top-0 z-40 w-full h-[56px] bg-[#1B2F8F] text-white flex items-center justify-between px-4 shadow-md">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg tracking-wider text-white border border-white/20">
          M
        </div>
        <span class="font-bold text-lg tracking-tight">メンズエステナビ</span>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="toggleSearchModal(true)" class="p-2 rounded-full hover:bg-white/10 transition touch-effect" aria-label="店舗検索">
          <i data-lucide="search" class="w-6 h-6 text-white"></i>
        </button>
      </div>
    </header>

    <!-- Area Quick Filter / Chips -->
    <section class="bg-slate-50 border-b border-[#E0E0E0] py-2 px-4">
      <div class="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <span class="text-xs font-bold text-gray-500 whitespace-nowrap flex items-center">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1 text-[#1B2F8F]"></i>エリア:
        </span>
        <button class="bg-[#1B2F8F] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm whitespace-nowrap">全国</button>
        <button class="bg-white border border-[#E0E0E0] text-[#222222] text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap touch-effect">新宿・歌舞伎町</button>
        <button class="bg-white border border-[#E0E0E0] text-[#222222] text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap touch-effect">渋谷・恵比寿</button>
        <button class="bg-white border border-[#E0E0E0] text-[#222222] text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap touch-effect">池袋</button>
        <button class="bg-white border border-[#E0E0E0] text-[#222222] text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap touch-effect">横浜・関内</button>
        <button class="bg-white border border-[#E0E0E0] text-[#222222] text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap touch-effect">梅田・難波</button>
      </div>
    </section>

    <!-- 4.8 Hero Carousel -->
    <div class="relative w-full overflow-hidden bg-gray-900 group">
      <div id="carousel-slides" class="flex transition-transform duration-500 ease-in-out">
        <!-- Slide 1 -->
        <div class="min-w-full relative aspect-[16/9] bg-slate-800">
          <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" alt="秋の新規オープン店舗大特集" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
            <span class="bg-[#E0407F] text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-1">期間限定キャンペーン</span>
            <h3 class="font-bold text-base leading-tight">秋の新規オープン特別クーポン大特集！最大3,000円OFF</h3>
          </div>
        </div>
        <!-- Slide 2 -->
        <div class="min-w-full relative aspect-[16/9] bg-slate-800">
          <img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80" alt="口コミ高評価ランキング" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
            <span class="bg-[#FFE234] text-[#222222] text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-1">殿堂入り人気店</span>
            <h3 class="font-bold text-base leading-tight">2026年上半期 口コミ＆満足度 総合グランプリ発表</h3>
          </div>
        </div>
      </div>
      <!-- Dots Indicator -->
      <div class="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5">
        <button onclick="goToSlide(0)" id="dot-0" class="w-2 h-2 rounded-full bg-white transition-all"></button>
        <button onclick="goToSlide(1)" id="dot-1" class="w-2 h-2 rounded-full bg-white/50 transition-all"></button>
      </div>
    </div>

    <!-- Shortcut Navigation (Horizontal Scroll / Compact Bar) -->
    <section class="py-3 px-4 bg-white border-b border-[#E0E0E0]">
      <div class="grid grid-cols-4 gap-2 text-center">
        <a href="#today-schedule" class="flex flex-col items-center p-2 rounded-lg bg-[#F4F4F4] touch-effect">
          <div class="w-10 h-10 rounded-full bg-[#E8ECFA] text-[#1B2F8F] flex items-center justify-center mb-1">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <span class="text-[11px] font-bold text-[#222222]">本日の出勤</span>
        </a>
        <a href="#popular-stores" class="flex flex-col items-center p-2 rounded-lg bg-[#F4F4F4] touch-effect">
          <div class="w-10 h-10 rounded-full bg-pink-100 text-[#E0407F] flex items-center justify-center mb-1">
            <i data-lucide="ticket-percent" class="w-5 h-5"></i>
          </div>
          <span class="text-[11px] font-bold text-[#222222]">クーポンあり</span>
        </a>
        <a href="#ranking" class="flex flex-col items-center p-2 rounded-lg bg-[#F4F4F4] touch-effect">
          <div class="w-10 h-10 rounded-full bg-amber-100 text-[#F5A623] flex items-center justify-center mb-1">
            <i data-lucide="trophy" class="w-5 h-5"></i>
          </div>
          <span class="text-[11px] font-bold text-[#222222]">ランキング</span>
        </a>
        <button onclick="toggleSearchModal(true)" class="flex flex-col items-center p-2 rounded-lg bg-[#F4F4F4] touch-effect">
          <div class="w-10 h-10 rounded-full bg-emerald-100 text-[#2E9E5B] flex items-center justify-center mb-1">
            <i data-lucide="sliders-horizontal" class="w-5 h-5"></i>
          </div>
          <span class="text-[11px] font-bold text-[#222222]">こだわり検索</span>
        </button>
      </div>
    </section>

    <!-- SECTION 1: 今すぐ案内可能・本日出勤 -->
    <div class="section-divider"></div>
    <section id="today-schedule" class="py-5 px-4 bg-white">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-3 border-b border-[#E0E0E0] pb-2">
        <div class="flex items-center space-x-1.5">
          <span class="text-[#1B2F8F] font-black text-sm">◆</span>
          <h2 class="text-[17px] font-bold text-[#222222]">本日すぐ案内可能な店舗</h2>
        </div>
        <a href="#" class="text-[13px] font-bold text-[#1B2F8F] hover:underline flex items-center">
          一覧 <i data-lucide="chevron-right" class="w-4 h-4 ml-0.5"></i>
        </a>
      </div>

      <!-- Compact Cards Horizontal Scroll -->
      <div class="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        <!-- Compact Card 1 -->
        <div class="min-w-[110px] w-[110px] flex-shrink-0 touch-effect cursor-pointer">
          <div class="relative w-[110px] h-[110px] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-1.5">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" alt="セラピスト写真" class="w-full h-full object-cover">
            <span class="absolute top-1 left-1 bg-[#2E9E5B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">空きあり</span>
          </div>
          <div class="text-[12px] font-bold text-[#222222] ellipsis-1">アロマリラクゼーション 恵比寿</div>
          <div class="text-[11px] text-[#888888] ellipsis-1">恵比寿駅 徒歩2分</div>
        </div>

        <!-- Compact Card 2 -->
        <div class="min-w-[110px] w-[110px] flex-shrink-0 touch-effect cursor-pointer">
          <div class="relative w-[110px] h-[110px] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-1.5">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="セラピスト写真" class="w-full h-full object-cover">
            <span class="absolute top-1 left-1 bg-[#2E9E5B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">営業中</span>
          </div>
          <div class="text-[12px] font-bold text-[#222222] ellipsis-1">SPA ROSE 新宿本店</div>
          <div class="text-[11px] text-[#888888] ellipsis-1">新宿東口 徒歩3分</div>
        </div>

        <!-- Compact Card 3 -->
        <div class="min-w-[110px] w-[110px] flex-shrink-0 touch-effect cursor-pointer">
          <div class="relative w-[110px] h-[110px] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-1.5">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" alt="セラピスト写真" class="w-full h-full object-cover">
            <span class="absolute top-1 left-1 bg-[#2E9E5B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">17:00〜</span>
          </div>
          <div class="text-[12px] font-bold text-[#222222] ellipsis-1">ラグジュアリーサロン 池袋</div>
          <div class="text-[11px] text-[#888888] ellipsis-1">池袋西口 徒歩1分</div>
        </div>

        <!-- Compact Card 4 -->
        <div class="min-w-[110px] w-[110px] flex-shrink-0 touch-effect cursor-pointer">
          <div class="relative w-[110px] h-[110px] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-1.5">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" alt="セラピスト写真" class="w-full h-full object-cover">
            <span class="absolute top-1 left-1 bg-[#2E9E5B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">空きあり</span>
          </div>
          <div class="text-[12px] font-bold text-[#222222] ellipsis-1">ヒーリングサロン 横浜</div>
          <div class="text-[11px] text-[#888888] ellipsis-1">横浜北口 徒歩4分</div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: 注目の人気店舗 Grid -->
    <div class="section-divider"></div>
    <section id="popular-stores" class="py-5 px-4 bg-white">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-3 border-b border-[#E0E0E0] pb-2">
        <div class="flex items-center space-x-1.5">
          <span class="text-[#1B2F8F] font-black text-sm">◆</span>
          <h2 class="text-[17px] font-bold text-[#222222]">注目の人気店舗</h2>
        </div>
        <a href="#" class="text-[13px] font-bold text-[#1B2F8F] hover:underline flex items-center">
          もっと見る <i data-lucide="chevron-right" class="w-4 h-4 ml-0.5"></i>
        </a>
      </div>

      <!-- 2-Column Grid -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Grid Card 1 -->
        <div class="touch-effect cursor-pointer flex flex-col">
          <div class="relative aspect-[16/9] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-2">
            <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=500&q=80" alt="店舗内装" class="w-full h-full object-cover">
            <div class="absolute bottom-0 inset-x-0 bg-[#1B2F8F]/85 text-white text-[10px] font-bold px-2 py-0.5 text-center">
              ポータル限定クーポン
            </div>
          </div>
          <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1 leading-tight mb-1">極上アロマスイート 新宿</h3>
          <p class="text-[12px] text-[#888888] ellipsis-1">新宿 / 90分 13,000円〜</p>
        </div>

        <!-- Grid Card 2 -->
        <div class="touch-effect cursor-pointer flex flex-col">
          <div class="relative aspect-[16/9] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-2">
            <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80" alt="店舗内装" class="w-full h-full object-cover">
            <div class="absolute bottom-0 inset-x-0 bg-[#E0407F]/85 text-white text-[10px] font-bold px-2 py-0.5 text-center">
              新人デビュー特典あり
            </div>
          </div>
          <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1 leading-tight mb-1">CLUB SILK 渋谷</h3>
          <p class="text-[12px] text-[#888888] ellipsis-1">渋谷 / 60分 10,000円〜</p>
        </div>

        <!-- Grid Card 3 -->
        <div class="touch-effect cursor-pointer flex flex-col">
          <div class="relative aspect-[16/9] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-2">
            <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=500&q=80" alt="店舗内装" class="w-full h-full object-cover">
            <span class="absolute top-1.5 left-1.5 bg-[#E0407F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">新店舗</span>
          </div>
          <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1 leading-tight mb-1">プレミアムSPA 銀座店</h3>
          <p class="text-[12px] text-[#888888] ellipsis-1">銀座 / 120分 20,000円〜</p>
        </div>

        <!-- Grid Card 4 -->
        <div class="touch-effect cursor-pointer flex flex-col">
          <div class="relative aspect-[16/9] rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100 mb-2">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80" alt="店舗内装" class="w-full h-full object-cover">
          </div>
          <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1 leading-tight mb-1">和風オイルセラピー 難波</h3>
          <p class="text-[12px] text-[#888888] ellipsis-1">難波 / 90分 12,000円〜</p>
        </div>
      </div>
    </section>

    <!-- SECTION 3: 総合ランキング (Tabs + List) -->
    <div class="section-divider"></div>
    <section id="ranking" class="py-5 bg-white">
      <!-- Section Header -->
      <div class="px-4 flex items-center justify-between mb-2">
        <div class="flex items-center space-x-1.5">
          <span class="text-[#1B2F8F] font-black text-sm">◆</span>
          <h2 class="text-[17px] font-bold text-[#222222]">アクセスランキング</h2>
        </div>
      </div>

      <!-- Ranking Filter Tabs -->
      <div class="flex border-b border-[#E0E0E0] px-4 overflow-x-auto no-scrollbar mb-3">
        <button onclick="switchRankTab('general')" id="tab-general" class="rank-tab-btn active py-2 px-3 text-[13px] font-medium whitespace-nowrap">総合</button>
        <button onclick="switchRankTab('new')" id="tab-new" class="rank-tab-btn text-[#888888] py-2 px-3 text-[13px] font-medium whitespace-nowrap">新店</button>
        <button onclick="switchRankTab('area')" id="tab-area" class="rank-tab-btn text-[#888888] py-2 px-3 text-[13px] font-medium whitespace-nowrap">関東エリア</button>
        <button onclick="switchRankTab('review')" id="tab-review" class="rank-tab-btn text-[#888888] py-2 px-3 text-[13px] font-medium whitespace-nowrap">口コミ高評価</button>
      </div>

      <!-- Ranking Items List -->
      <div id="ranking-list" class="divide-y divide-[#E0E0E0]">
        
        <!-- Ranking Item 1 (Gold) -->
        <div class="px-4 py-3 flex space-x-3 items-center touch-effect cursor-pointer">
          <div class="relative w-[130px] h-[88px] flex-shrink-0 rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80" alt="1位店舗" class="w-full h-full object-cover">
            <!-- Rank Badge Gold -->
            <div class="absolute top-0 left-0 bg-amber-400 text-white font-black text-[12px] w-6 h-6 flex items-center justify-center rounded-br-md shadow">
              1
            </div>
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1">グランドスウィート 新宿本店</h3>
              <p class="text-[12px] text-[#888888] ellipsis-1 mt-0.5">新宿駅南口徒歩2分 / 落ち着いた個室空間</p>
              <p class="text-[11px] font-bold text-[#E0407F] ellipsis-1 mt-0.5">新規限定 90分 12,000円（3,000円OFF）</p>
            </div>
            <div class="flex items-center justify-end space-x-3 text-[12px] text-[#888888] mt-1">
              <span class="flex items-center text-[#D93025] font-bold"><i data-lucide="thumbs-up" class="w-3.5 h-3.5 mr-1"></i>25,351</span>
              <span class="flex items-center text-[#F5A623] font-bold"><i data-lucide="star" class="w-3.5 h-3.5 mr-1 fill-amber-400"></i>4.9</span>
            </div>
          </div>
        </div>

        <!-- Ranking Item 2 (Silver) -->
        <div class="px-4 py-3 flex space-x-3 items-center touch-effect cursor-pointer">
          <div class="relative w-[130px] h-[88px] flex-shrink-0 rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100">
            <img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=300&q=80" alt="2位店舗" class="w-full h-full object-cover">
            <!-- Rank Badge Silver -->
            <div class="absolute top-0 left-0 bg-slate-300 text-slate-800 font-black text-[12px] w-6 h-6 flex items-center justify-center rounded-br-md shadow">
              2
            </div>
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1">アロマオアシス 恵比寿</h3>
              <p class="text-[12px] text-[#888888] ellipsis-1 mt-0.5">恵比寿駅すぐ / 洗練された完全個室</p>
              <p class="text-[11px] font-bold text-[#E0407F] ellipsis-1 mt-0.5">本日出勤セラピスト多数！即案内可能</p>
            </div>
            <div class="flex items-center justify-end space-x-3 text-[12px] text-[#888888] mt-1">
              <span class="flex items-center text-[#D93025] font-bold"><i data-lucide="thumbs-up" class="w-3.5 h-3.5 mr-1"></i>19,820</span>
              <span class="flex items-center text-[#F5A623] font-bold"><i data-lucide="star" class="w-3.5 h-3.5 mr-1 fill-amber-400"></i>4.8</span>
            </div>
          </div>
        </div>

        <!-- Ranking Item 3 (Bronze) -->
        <div class="px-4 py-3 flex space-x-3 items-center touch-effect cursor-pointer">
          <div class="relative w-[130px] h-[88px] flex-shrink-0 rounded-md overflow-hidden border border-[#E0E0E0] bg-gray-100">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" alt="3位店舗" class="w-full h-full object-cover">
            <!-- Rank Badge Bronze -->
            <div class="absolute top-0 left-0 bg-amber-600 text-white font-black text-[12px] w-6 h-6 flex items-center justify-center rounded-br-md shadow">
              3
            </div>
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h3 class="text-[14px] font-bold text-[#222222] ellipsis-1">スパ・リラクゼーション 池袋</h3>
              <p class="text-[12px] text-[#888888] ellipsis-1 mt-0.5">池袋東口徒歩4分 / 最高級オイル使用</p>
              <p class="text-[11px] font-bold text-[#E0407F] ellipsis-1 mt-0.5">Web予約でさらに500ptプレゼント</p>
            </div>
            <div class="flex items-center justify-end space-x-3 text-[12px] text-[#888888] mt-1">
              <span class="flex items-center text-[#D93025] font-bold"><i data-lucide="thumbs-up" class="w-3.5 h-3.5 mr-1"></i>14,210</span>
              <span class="flex items-center text-[#F5A623] font-bold"><i data-lucide="star" class="w-3.5 h-3.5 mr-1 fill-amber-400"></i>4.7</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Primary CTA Button (Section End) -->
      <div class="p-4">
        <button class="w-full h-[48px] bg-[#1B2F8F] text-white font-bold text-[14px] rounded-md flex items-center justify-center space-x-2 touch-effect shadow-sm">
          <span>ランキングの続きを見る</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>
    </section>

    <!-- SECTION 4: 期間限定キャンペーン & 特集バナー -->
    <div class="section-divider"></div>
    <section class="py-5 px-4 bg-white">
      <div class="flex items-center justify-between mb-3 border-b border-[#E0E0E0] pb-2">
        <div class="flex items-center space-x-1.5">
          <span class="text-[#1B2F8F] font-black text-sm">◆</span>
          <h2 class="text-[17px] font-bold text-[#222222]">特集・キャンペーン</h2>
        </div>
      </div>

      <!-- Special Banner Card 1 -->
      <div class="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-pink-600 to-rose-500 text-white p-4 mb-3 shadow-sm touch-effect cursor-pointer flex items-center justify-between">
        <div>
          <span class="bg-[#FFE234] text-[#222222] font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Point Up</span>
          <h3 class="font-bold text-base mt-1">新規会員登録で今すぐ使える<br><span class="text-2xl font-black text-[#FFE234]">1,000pt</span> プレゼント！</h3>
          <p class="text-[11px] opacity-90 mt-0.5">有効期限：2026年10月31日まで</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ml-2">
          <i data-lucide="gift" class="w-6 h-6 text-[#FFE234]"></i>
        </div>
      </div>

      <!-- Special Banner Card 2 -->
      <div class="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-indigo-900 to-[#1B2F8F] text-white p-4 shadow-sm touch-effect cursor-pointer flex items-center justify-between">
        <div>
          <span class="bg-blue-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">安心ポータルガイド</span>
          <h3 class="font-bold text-base mt-1">初めての方へ メンズエステの選び方と<br>利用ルールのご案内</h3>
        </div>
        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ml-2">
          <i data-lucide="shield-check" class="w-5 h-5 text-white"></i>
        </div>
      </div>
    </section>

    <!-- 4.11 Footer -->
    <footer class="bg-[#12206A] text-white pt-6 pb-8 px-4 mt-auto">
      <!-- 2-Column Button Cards -->
      <div class="grid grid-cols-2 gap-2 mb-6">
        <a href="#" class="h-[54px] bg-white/10 rounded-lg flex items-center px-3 space-x-2 text-xs font-bold hover:bg-white/20 transition touch-effect">
          <i data-lucide="message-circle" class="w-5 h-5 text-emerald-400"></i>
          <span>公式LINEアカウント</span>
        </a>
        <a href="#" class="h-[54px] bg-white/10 rounded-lg flex items-center px-3 space-x-2 text-xs font-bold hover:bg-white/20 transition touch-effect">
          <i data-lucide="book-open" class="w-5 h-5 text-blue-300"></i>
          <span>ご利用ガイド</span>
        </a>
        <a href="#" class="h-[54px] bg-white/10 rounded-lg flex items-center px-3 space-x-2 text-xs font-bold hover:bg-white/20 transition touch-effect">
          <i data-lucide="help-circle" class="w-5 h-5 text-amber-300"></i>
          <span>よくある質問</span>
        </a>
        <a href="#" class="h-[54px] bg-white/10 rounded-lg flex items-center px-3 space-x-2 text-xs font-bold hover:bg-white/20 transition touch-effect">
          <i data-lucide="mail" class="w-5 h-5 text-pink-300"></i>
          <span>お問い合わせ</span>
        </a>
      </div>

      <!-- Notice & Legal Text -->
      <div class="border-t border-white/10 pt-4 text-[11px] text-gray-300 space-y-2 leading-relaxed">
        <p class="bg-black/20 p-2.5 rounded text-gray-300 border border-white/5">
          【年齢確認】当ポータルサイトは18歳未満の方のアクセスをお断りしております。掲載店舗は法令を遵守し届出済みの上営業しております。
        </p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-gray-400 pt-2">
          <a href="#" class="hover:underline">運営会社情報</a>
          <a href="#" class="hover:underline">利用規約</a>
          <a href="#" class="hover:underline">プライバシーポリシー</a>
          <a href="#" class="hover:underline">掲載に関するお問い合わせ</a>
        </div>
      </div>

      <!-- Footer Brand Logo -->
      <div class="mt-6 text-center">
        <div class="text-sm font-bold tracking-widest text-white/80">MENS ESTHE NAVI PORTAL</div>
        <div class="text-[10px] text-gray-400 mt-1">© 2026 Mens Esthe Navi All Rights Reserved.</div>
      </div>
    </footer>

    <!-- 4.9 Back-to-Top FAB Button -->
    <button id="fab-top" onclick="scrollToTop()" class="fixed bottom-[80px] right-4 md:right-[calc(50%-340px)] w-12 h-12 rounded-full bg-[#12206A]/90 text-white shadow-lg flex items-center justify-center z-30 transition-opacity duration-200 opacity-0 pointer-events-none touch-effect">
      <i data-lucide="arrow-up" class="w-5 h-5"></i>
    </button>

    <!-- 4.2 Fixed Bottom Tab Bar -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-[720px] mx-auto h-[64px] bg-white border-t border-[#E0E0E0] z-40 flex items-center justify-around px-1 shadow-lg">
      
      <!-- Tab 1: TOP (Active) -->
      <a href="#" class="flex flex-col items-center justify-center w-full h-full text-center tab-active touch-effect">
        <i data-lucide="home" class="w-6 h-6 mb-0.5"></i>
        <span class="text-[11px]">TOP</span>
      </a>

      <!-- Tab 2: 店舗を探す -->
      <button onclick="toggleSearchModal(true)" class="flex flex-col items-center justify-center w-full h-full text-center text-[#888888] touch-effect">
        <i data-lucide="compass" class="w-6 h-6 mb-0.5"></i>
        <span class="text-[11px]">店舗を探す</span>
      </button>

      <!-- Tab 3: ランキング -->
      <a href="#ranking" class="flex flex-col items-center justify-center w-full h-full text-center text-[#888888] touch-effect">
        <i data-lucide="crown" class="w-6 h-6 mb-0.5"></i>
        <span class="text-[11px]">ランキング</span>
      </a>

      <!-- Tab 4: お気に入り -->
      <a href="#" class="flex flex-col items-center justify-center w-full h-full text-center text-[#888888] touch-effect relative">
        <i data-lucide="heart" class="w-6 h-6 mb-0.5"></i>
        <span class="text-[11px]">お気に入り</span>
        <span class="absolute top-1.5 right-4 bg-[#E0407F] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
      </a>

      <!-- Tab 5: マイページ -->
      <a href="#" class="flex flex-col items-center justify-center w-full h-full text-center text-[#888888] touch-effect">
        <i data-lucide="user" class="w-6 h-6 mb-0.5"></i>
        <span class="text-[11px]">マイページ</span>
      </a>

    </nav>

  </div>

  <!-- Interactive Search Modal / Bottom Sheet -->
  <div id="search-modal" class="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end opacity-0 pointer-events-none transition-opacity duration-200">
    <div class="bg-white rounded-t-2xl max-w-[720px] w-full mx-auto p-4 max-h-[85vh] overflow-y-auto shadow-2xl transition-transform duration-300 transform translate-y-full" id="search-modal-content">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-[#E0E0E0] pb-3 mb-4">
        <h3 class="text-base font-bold text-[#222222] flex items-center">
          <i data-lucide="search" class="w-5 h-5 text-[#1B2F8F] mr-2"></i>条件絞り込み検索
        </h3>
        <button onclick="toggleSearchModal(false)" class="p-1 text-gray-500 hover:text-gray-800">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>

      <!-- Area Selection -->
      <div class="mb-4">
        <label class="block text-xs font-bold text-gray-700 mb-2">エリア選択</label>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button class="p-2 border border-[#1B2F8F] bg-[#E8ECFA] text-[#1B2F8F] font-bold rounded">新宿・歌舞伎町</button>
          <button class="p-2 border border-gray-200 rounded text-gray-700">渋谷・恵比寿</button>
          <button class="p-2 border border-gray-200 rounded text-gray-700">池袋</button>
          <button class="p-2 border border-gray-200 rounded text-gray-700">品川・五反田</button>
          <button class="p-2 border border-gray-200 rounded text-gray-700">横浜・関内</button>
          <button class="p-2 border border-gray-200 rounded text-gray-700">梅田・難波</button>
        </div>
      </div>

      <!-- Price Range -->
      <div class="mb-4">
        <label class="block text-xs font-bold text-gray-700 mb-2">料金帯</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button class="p-2 border border-gray-200 rounded text-gray-700">10,000円〜15,000円</button>
          <button class="p-2 border border-gray-200 rounded text-gray-700">15,000円〜20,000円</button>
        </div>
      </div>

      <!-- Detailed Conditions -->
      <div class="mb-6">
        <label class="block text-xs font-bold text-gray-700 mb-2">こだわり条件</label>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 cursor-pointer">完全個室</span>
          <span class="px-3 py-1.5 rounded-full bg-[#E8ECFA] border border-[#1B2F8F] text-[#1B2F8F] font-bold cursor-pointer">本日出勤あり</span>
          <span class="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 cursor-pointer">割引クーポンあり</span>
          <span class="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 cursor-pointer">新人限定コース</span>
        </div>
      </div>

      <!-- Search CTA Button -->
      <button onclick="toggleSearchModal(false)" class="w-full h-[48px] bg-[#1B2F8F] text-white font-bold text-sm rounded-md shadow flex items-center justify-center space-x-2">
        <span>この条件で検索する (42件)</span>
      </button>

    </div>
  </div>

  <!-- Age Verification Gate Overlay (Simulated) -->
  <div id="age-gate" class="fixed inset-0 bg-[#12206A]/95 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl p-6 max-w-[360px] w-full text-center shadow-2xl">
      <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <i data-lucide="shield-alert" class="w-6 h-6"></i>
      </div>
      <h2 class="text-lg font-bold text-[#222222] mb-2">年齢確認</h2>
      <p class="text-xs text-gray-600 mb-6 leading-relaxed">
        当サイトはメンズエステの情報ポータルサイトです。<br>あなたは18歳以上ですか？
      </p>
      <div class="space-y-2">
        <button onclick="dismissAgeGate()" class="w-full py-3 bg-[#1B2F8F] text-white font-bold text-sm rounded-md shadow touch-effect">
          はい（18歳以上です）
        </button>
        <button onclick="alert('18歳未満の方はご利用いただけません。')" class="w-full py-2.5 bg-gray-100 text-gray-600 font-medium text-xs rounded-md touch-effect">
          いいえ（18歳未満）
        </button>
      </div>
    </div>
  </div>

  <!-- Interactive Scripts -->
  <script>
    // Initialize Lucide Icons
    lucide.createIcons();

    // Carousel Logic
    let currentSlide = 0;
    const slidesContainer = document.getElementById('carousel-slides');
    const totalSlides = 2;

    function goToSlide(index) {
      currentSlide = index;
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
      // Update dots
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (i === index) {
          dot.className = "w-2 h-2 rounded-full bg-white transition-all";
        } else {
          dot.className = "w-2 h-2 rounded-full bg-white/50 transition-all";
        }
      }
    }

    // Auto Slide Carousel
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }, 5000);

    // Search Modal Toggle
    function toggleSearchModal(show) {
      const modal = document.getElementById('search-modal');
      const modalContent = document.getElementById('search-modal-content');
      
      if (show) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          modalContent.classList.remove('translate-y-full');
        }, 10);
      } else {
        modalContent.classList.add('translate-y-full');
        setTimeout(() => {
          modal.classList.add('opacity-0', 'pointer-events-none');
        }, 200);
      }
    }

    // Dismiss Age Verification Overlay
    function dismissAgeGate() {
      const gate = document.getElementById('age-gate');
      gate.style.opacity = '0';
      gate.style.transition = 'opacity 250ms ease';
      setTimeout(() => {
        gate.style.display = 'none';
      }, 250);
    }

    // Back to Top FAB Visibility on Scroll
    const fabTop = document.getElementById('fab-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        fabTop.classList.remove('opacity-0', 'pointer-events-none');
        fabTop.classList.add('opacity-100');
      } else {
        fabTop.classList.add('opacity-0', 'pointer-events-none');
        fabTop.classList.remove('opacity-100');
      }
    });

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Tab Switcher Mock
    function switchRankTab(tabKey) {
      const tabs = document.querySelectorAll('.rank-tab-btn');
      tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('text-[#888888]');
      });
      const activeTab = document.getElementById(`tab-${tabKey}`);
      if (activeTab) {
        activeTab.classList.add('active');
        activeTab.classList.remove('text-[#888888]');
      }
    }
  </script>
</body>
</html>