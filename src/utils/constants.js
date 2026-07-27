// ==========================================================
// 1. THÔNG TIN CHUNG & THỜI GIAN
// ==========================================================
export const FIRST_MESSAGE_DATE = new Date('2025-08-07T20:37:00');
export const COUPLE_NAME = "mphu & kphun";

export const HERO_TITLE = "Anniversary";
export const HERO_SUBTITLE = "Kỷ niệm 1 năm kể từ tin nhắn đầu tiên giữa anh và em";

// ==========================================================
// 2. DANH SÁCH NHẠC NỀN (BGM)
// ==========================================================
export const BGM_PLAYLIST = [
  { title: "About You", src: "./audio/bgm/01-about-you.mp3" },
  { title: "A Thousand Years", src: "./audio/bgm/02-a-thousand-years.mp3" },
  { title: "Beautiful In White", src: "./audio/bgm/03-beautiful-in-white.mp3" },
  { title: "River Flows In You", src: "./audio/bgm/04-river-flows-in-you.mp3" },
  { title: "Blue", src: "./audio/bgm/05-blue.mp3" },
  { title: "Beauty And A Beat", src: "./audio/bgm/06-beauty-and-a-beat.mp3" },
  { title: "Love", src: "./audio/bgm/07-love.mp3" },
  { title: "Seasons", src: "./audio/bgm/08-seasons.mp3" }
];

// ==========================================================
// 3. NỘI DUNG TIN NHẮN (BOX CHAT)
// ==========================================================
export const MESSAGES_FIRST_CHAT = [
  { sender: "System", text: "08:37 PM, 7 TH8" },
  { sender: "Em", text: "/Đã nhắc đến bạn trong tin của mình/" },
  { sender: "Em", text: "Ô voãi" },
  { sender: "Em", text: "N gửi tn cho b ad" },
  { sender: "Em", text: "À" },
  { sender: "Em", text: "Ê ngại tht" },
  { sender: "Anh", text: "Tui cx kbt là ins tag tên là nói gửi tn luôn =))" },
  { sender: "Em", text: "Ê tui ngại waaa" },
  { sender: "Em", text: "Ê nma tui thích tóc b" },
  { sender: "Anh", text: "tóc đó hồi tháng rui" },
  { sender: "Anh", text: "giờ tóc tui như cuốn sách úp lên đầu" }
];

export const MESSAGES_CONFESSION_CHAT = [
  { sender: "Em", text: "z để mk in cái mặt mk lên đầu bn nhé" },
  { sender: "Em", text: "h mk mới nhận ra đó bn" },
  { sender: "Em", text: "đó g mk lười rep tn lắm bn, nhắn dc 3 câu mk bỏ lưu trữ rầu" },
  { sender: "Em", text: "nma mk ngồi nhắn cả tiếng với bn cx 0 sao hết" },
  { sender: "Em", text: "hehe người đặc biệt duy nhất khiến mk thoải mái như thế" },
  { sender: "Em", text: "g mk mới biết đó là iu" }
];

// ==========================================================
// 4. CÁC CỘT MỐC KỶ NIỆM (TIMELINE) – giữ nguyên gốc
// ==========================================================
export const SPECIAL_DATES = [
  {
    date: "07/08/2025",
    label: "Tin nhắn đầu tiên",
    folder: "./images/07082025/",
    description: "",
    images: [
      { type: 'image', src: './images/textures/giftbox.webp', alt: 'Hộp quà kỷ niệm' }
    ]
  },
  {
    date: "08/01/2026",
    label: "Hộp quà đầu tiên em tặng",
    folder: "./images/08012026/",
    description: "",
    images: [
      { type: 'image', src: './images/08012026/1.webp', alt: '' },
      { type: 'image', src: './images/08012026/2.webp', alt: '' },
      { type: 'image', src: './images/08012026/3.webp', alt: '' },
      { type: 'image', src: './images/08012026/4.webp', alt: '' },
      { type: 'image', src: './images/08012026/5.webp', alt: '' },
      { type: 'image', src: './images/08012026/6.webp', alt: '' },
      { type: 'video', src: './images/08012026/7.mp4', alt: '' }
    ]
  },
  {
    date: "30/01/2026",
    label: "Hộp quà đầu tiên anh tặng",
    folder: "./images/30012026/",
    description: "",
    images: [
      { type: 'image', src: './images/30012026/1.webp', alt: '' }
    ]
  },
  {
    date: "26/02/2026",
    label: "Món quà thứ hai em tặng",
    folder: "./images/26022026/",
    description: "",
    images: [
      { type: 'image', src: './images/26022026/1.webp', alt: '' },
      { type: 'image', src: './images/26022026/2.webp', alt: '' },
      { type: 'video', src: './images/26022026/3.mp4', alt: '' }
    ]
  },
  {
    date: "29/04/2026",
    label: "Em đồng ý làm bạn gái anh",
    folder: "./images/28052026/",
    description: "",
    images: [
      { type: 'image', src: './images/chiikawa/lovechii.webp', alt: 'Love' }
    ]
  },
  {
    date: "04/05/2026",
    label: "Món quà thứ ba em tặng",
    folder: "./images/04052026/",
    description: "",
    images: [
      { type: 'image', src: './images/04052026/1.webp', alt: '' },
      { type: 'image', src: './images/04052026/2.webp', alt: '' },
      { type: 'image', src: './images/04052026/3.webp', alt: '' },
      { type: 'image', src: './images/04052026/4.webp', alt: '' },
      { type: 'image', src: './images/04052026/5.webp', alt: '' },
      { type: 'image', src: './images/04052026/6.webp', alt: '' },
      { type: 'video', src: './images/04052026/7.mp4', alt: '' }
    ]
  },
  {
    date: "15/06/2026",
    label: "Hộp quà thứ hai anh tặng",
    folder: "./images/15062026/",
    description: "",
    images: [
      { type: 'image', src: './images/15062026/1.webp', alt: '' },
      { type: 'image', src: './images/15062026/2.webp', alt: '' },
      { type: 'image', src: './images/15062026/3.webp', alt: '' },
      { type: 'image', src: './images/15062026/4.webp', alt: '' }
    ]
  },
  {
    date: "08/07/2026",
    label: "Lần đầu tụi mình gặp nhau",
    folder: "./images/08072026/",
    images: [
      { type: 'image', src: './images/08072026/1.webp', alt: '' },
      { type: 'image', src: './images/08072026/2.webp', alt: '' },
      { type: 'image', src: './images/08072026/3.webp', alt: '' },
      { type: 'image', src: './images/08072026/4.webp', alt: '' },
      { type: 'image', src: './images/08072026/5.webp', alt: '' },
      { type: 'image', src: './images/08072026/6.webp', alt: '' },
      { type: 'image', src: './images/08072026/7.webp', alt: '' },
      { type: 'video', src: './images/08072026/8.mp4', alt: '' },
      { type: 'image', src: './images/08072026/9.webp', alt: '' },
      { type: 'video', src: './images/08072026/10.mp4', alt: '' },
      { type: 'image', src: './images/08072026/11.webp', alt: '' },
      { type: 'image', src: './images/08072026/12.webp', alt: '' }
    ]
  }
];

// ==========================================================
// 5. TIMELINE PHÂN THEO SECTION (Req 11)
//    Space: câu chuyện bắt đầu từ vũ trụ (tin nhắn đầu tiên)
//    Sky: những món quà gửi qua bầu trời (quà 1 em, quà 1 anh, quà 2 em)
//    Grass: tình yêu nảy nở từ mặt đất (quà 3 em, ngày tỏ tình, quà 2 anh)
//    Ocean: tình cảm sâu sắc hòa chung làm một (lần đầu gặp nhau)
// ==========================================================
export const SPACE_TIMELINE = [
  SPECIAL_DATES[0], // 07/08/2025: Tin nhắn đầu tiên
];

export const SKY_TIMELINE = [
  SPECIAL_DATES[1], // 08/01/2026: Hộp quà đầu tiên em tặng
  SPECIAL_DATES[2], // 30/01/2026: Hộp quà đầu tiên anh tặng
  SPECIAL_DATES[3], // 26/02/2026: Món quà thứ hai em tặng
];

export const GRASS_TIMELINE = [
  SPECIAL_DATES[4], // 29/04/2026: Em đồng ý làm bạn gái anh
  SPECIAL_DATES[5], // 04/05/2026: Món quà thứ ba em tặng
  SPECIAL_DATES[6], // 15/06/2026: Hộp quà thứ hai anh tặng
];

export const OCEAN_TIMELINE = [
  SPECIAL_DATES[7], // 08/07/2026: Lần đầu tụi mình gặp nhau
];

// ==========================================================
// 6. BẢN ĐỒ SAO THỰC TẾ (Req 5 & 12)
//    Mô phỏng bầu trời Sài Gòn (10.82°N, 106.63°E)
//    đêm 07/08/2025, 20:37 (GMT+7) cực kỳ nhiều sao và chi tiết.
//    Chòm sao chính: Tam giác mùa hè (Vega, Altair, Deneb)
//    + Gấu Lớn (Ursa Major) + Scorpius + Nam Thập Tự + Thiên Hậu
//    Tọa độ sao % trên khung nhìn (0-100).
// ==========================================================
export const CONSTELLATION_DATA = {
  location: "Sài Gòn, Việt Nam",
  nightOf: "07/08/2025",
  stars: [
    // --- Tam giác mùa hè ---
    { id: "vega",     name: "Vega (Chức Nữ)",     x: 35, y: 15, size: 5.5, glow: true,  color: "#aaccff" },
    { id: "altair",   name: "Altair (Ngưu Lang)",  x: 55, y: 35, size: 5, glow: true, color: "#ffffff" },
    { id: "deneb",    name: "Deneb (Thiên Tân)",    x: 42, y: 10, size: 4.8, glow: true,  color: "#ffddaa" },

    // --- Scorpius (Thần Nông) ---
    { id: "antares",  name: "Antares (Tâm Túc)",    x: 62, y: 68, size: 6, glow: true, color: "#ff5533" },
    { id: "graffias", name: "Graffias",           x: 54, y: 62, size: 2.5, glow: false, color: "#ffaa88" },
    { id: "dshubba",  name: "Dschubba",           x: 58, y: 65, size: 2.8, glow: false, color: "#ffffff" },
    { id: "shaula",   name: "Shaula (Vĩ Túc)",      x: 74, y: 82, size: 4.2, glow: true,  color: "#88ccff" },
    { id: "sargas",   name: "Sargas",             x: 71, y: 78, size: 3.2, glow: false, color: "#aaddff" },

    // --- Gấu Lớn (Ursa Major - Bắc Đẩu 7 sao) ---
    { id: "dubhe",    name: "Dubhe (Thiên Xu)",    x: 12, y: 22, size: 4, glow: true, color: "#ffeecc" },
    { id: "merak",    name: "Merak (Thiên Toàn)",   x: 11, y: 28, size: 3.5, glow: false, color: "#ffffff" },
    { id: "phecda",   name: "Phecda (Thiên Cơ)",   x: 17, y: 29, size: 3.5, glow: false, color: "#ffffff" },
    { id: "megrez",   name: "Megrez (Thiên Quyền)",  x: 19, y: 25, size: 3, glow: false, color: "#ffffff" },
    { id: "alioth",   name: "Alioth (Ngọc Hành)",   x: 24, y: 23, size: 4, glow: true, color: "#aaddff" },
    { id: "mizar",    name: "Mizar (Khai Dương)",   x: 28, y: 21, size: 3.8, glow: false, color: "#ffffff" },
    { id: "alkaid",   name: "Alkaid (Dao Quang)",   x: 32, y: 18, size: 4, glow: true, color: "#88bbff" },

    // --- Cassiopeia (Thiên Hậu - Chữ W) ---
    { id: "caph",     name: "Caph",               x: 82, y: 12, size: 3.8, glow: true, color: "#ffffff" },
    { id: "schedar",  name: "Schedar",            x: 85, y: 16, size: 4.2, glow: true, color: "#ffeedd" },
    { id: "cih",      name: "Cih",                x: 89, y: 13, size: 4, glow: false, color: "#aaccff" },
    { id: "ruchbah",  name: "Ruchbah",            x: 93, y: 17, size: 3.5, glow: false, color: "#ffffff" },
    { id: "segin",    name: "Segin",              x: 96, y: 14, size: 3, glow: false, color: "#ffffff" },

    // --- Điểm mốc yêu thương ---
    { id: "moon",     name: "Trăng tròn Sài Gòn",   x: 76, y: 48, size: 8, glow: true,  color: "#ffffcc" },
    { id: "destiny",  name: "Gặp gỡ: 07/08/2025",   x: 50, y: 50, size: 5.5, glow: true,  color: "#fbcfe8" },
    { id: "mphu",     name: "Minh Phú 29/09/2008",   x: 28, y: 42, size: 4.5, glow: true,  color: "#bae6fd" },
    { id: "kphun",    name: "Khánh Phụng 02/09/2009",x: 72, y: 38, size: 4.5, glow: true,  color: "#fbcfe8" },
    { id: "polaris",  name: "Polaris (Sao Bắc Cực)",x: 10, y: 8,  size: 5, glow: true,  color: "#ffffdd" },

    // --- Hơn 50 ngôi sao nền thực tế ẩn danh để bầu trời dày đặc ---
    { id: "bg1", x: 5, y: 15, size: 1.5, color: "#ffffff" },
    { id: "bg2", x: 8, y: 35, size: 1.2, color: "#aaccff" },
    { id: "bg3", x: 14, y: 45, size: 1.8, color: "#ffeedd" },
    { id: "bg4", x: 18, y: 12, size: 0.9, color: "#ffffff" },
    { id: "bg5", x: 22, y: 32, size: 2.1, color: "#ffffff" },
    { id: "bg6", x: 26, y: 8, size: 1.1, color: "#aaccff" },
    { id: "bg7", x: 30, y: 28, size: 1.4, color: "#ffffff" },
    { id: "bg8", x: 33, y: 48, size: 1.7, color: "#ffddaa" },
    { id: "bg9", x: 38, y: 22, size: 1.0, color: "#ffffff" },
    { id: "bg10", x: 40, y: 38, size: 2.3, color: "#88ccff" },
    { id: "bg11", x: 44, y: 18, size: 1.3, color: "#ffffff" },
    { id: "bg12", x: 46, y: 55, size: 1.5, color: "#ffeedd" },
    { id: "bg13", x: 49, y: 29, size: 1.1, color: "#ffffff" },
    { id: "bg14", x: 52, y: 12, size: 2.0, color: "#aaccff" },
    { id: "bg15", x: 58, y: 24, size: 1.4, color: "#ffffff" },
    { id: "bg16", x: 60, y: 46, size: 1.6, color: "#ffffff" },
    { id: "bg17", x: 63, y: 15, size: 1.2, color: "#ffeedd" },
    { id: "bg18", x: 66, y: 31, size: 1.9, color: "#ffffff" },
    { id: "bg19", x: 68, y: 58, size: 1.0, color: "#aaccff" },
    { id: "bg20", x: 70, y: 19, size: 1.5, color: "#ffffff" },
    { id: "bg21", x: 74, y: 26, size: 1.2, color: "#ffddaa" },
    { id: "bg22", x: 78, y: 10, size: 2.2, color: "#ffffff" },
    { id: "bg23", x: 80, y: 42, size: 1.4, color: "#88ccff" },
    { id: "bg24", x: 84, y: 28, size: 1.1, color: "#ffffff" },
    { id: "bg25", x: 86, y: 52, size: 1.6, color: "#ffeedd" },
    { id: "bg26", x: 90, y: 33, size: 1.3, color: "#ffffff" },
    { id: "bg27", x: 92, y: 8, size: 1.8, color: "#aaccff" },
    { id: "bg28", x: 95, y: 25, size: 1.0, color: "#ffffff" },
    { id: "bg29", x: 98, y: 40, size: 1.5, color: "#ffeedd" },
    { id: "bg30", x: 15, y: 65, size: 1.4, color: "#ffffff" },
    { id: "bg31", x: 20, y: 72, size: 1.2, color: "#aaccff" },
    { id: "bg32", x: 24, y: 85, size: 1.7, color: "#ffffff" },
    { id: "bg33", x: 29, y: 60, size: 1.1, color: "#ffeedd" },
    { id: "bg34", x: 34, y: 78, size: 2.0, color: "#ffffff" },
    { id: "bg35", x: 37, y: 68, size: 1.3, color: "#88ccff" },
    { id: "bg36", x: 42, y: 82, size: 1.5, color: "#ffffff" },
    { id: "bg37", x: 45, y: 63, size: 1.1, color: "#ffeedd" },
    { id: "bg38", x: 48, y: 75, size: 1.9, color: "#ffffff" },
    { id: "bg39", x: 51, y: 88, size: 1.2, color: "#aaccff" },
    { id: "bg40", x: 55, y: 78, size: 1.4, color: "#ffffff" },
    { id: "bg41", x: 60, y: 92, size: 1.6, color: "#ffddaa" },
    { id: "bg42", x: 65, y: 80, size: 1.1, color: "#ffffff" },
    { id: "bg43", x: 68, y: 94, size: 1.8, color: "#88ccff" },
    { id: "bg44", x: 72, y: 86, size: 1.3, color: "#ffffff" },
    { id: "bg45", x: 76, y: 72, size: 1.5, color: "#ffeedd" },
    { id: "bg46", x: 79, y: 90, size: 1.1, color: "#ffffff" },
    { id: "bg47", x: 82, y: 64, size: 2.1, color: "#aaccff" },
    { id: "bg48", x: 85, y: 78, size: 1.2, color: "#ffffff" },
    { id: "bg49", x: 89, y: 68, size: 1.6, color: "#ffffff" },
    { id: "bg50", x: 93, y: 84, size: 1.0, color: "#ffeedd" },
    { id: "bg51", x: 96, y: 70, size: 1.4, color: "#ffffff" },
  ],
  connections: [
    // Tam giác mùa hè
    ["vega", "deneb"], ["deneb", "altair"], ["altair", "vega"],
    // Scorpius
    ["graffias", "dshubba"], ["dshubba", "antares"], ["antares", "sargas"], ["sargas", "shaula"],
    // Gấu Lớn (Big Dipper)
    ["dubhe", "merak"], ["merak", "phecda"], ["phecda", "megrez"], ["megrez", "alioth"], ["alioth", "mizar"], ["mizar", "alkaid"],
    // Cassiopeia
    ["caph", "schedar"], ["schedar", "cih"], ["cih", "ruchbah"], ["ruchbah", "segin"],
    // Cầu nối Minh Phú - Khánh Phụng - Định mệnh
    ["mphu", "destiny"], ["kphun", "destiny"], ["destiny", "moon"],
    // Chỉ hướng Polaris từ Gấu Lớn
    ["merak", "dubhe"], ["dubhe", "polaris"]
  ]
};

// ==========================================================
// 7. ẢNH PHÂN THEO SECTION (Req 4 & 7)
//    Trải đều tất cả ảnh lẻ, ảnh kỷ niệm vào không gian phù hợp
// ==========================================================
export const SECTION_MEDIA = {
  space: [
    { type: 'image', src: './images/yourforever.webp', alt: '' },
    { type: 'image', src: './images/mphuchayxe.webp', alt: '' },
    { type: 'image', src: './images/mphuhocbai.webp', alt: '' },
  ],
  sky: [
    { type: 'image', src: './images/voiu1.webp', alt: '' },
    { type: 'image', src: './images/voiu2.webp', alt: '' },
    { type: 'image', src: './images/voiu3.webp', alt: '' },
  ],
  grass: [
    { type: 'image', src: './images/voiu4.webp', alt: '' },
    { type: 'image', src: './images/doiu5.webp', alt: '' },
    { type: 'image', src: './images/doiu6.webp', alt: '' },
  ],
  ocean: [
    { type: 'image', src: './images/doiu7.webp', alt: '' },
    { type: 'image', src: './images/doiu8.webp', alt: '' },
    { type: 'image', src: './images/doiu9.webp', alt: '' },
    { type: 'image', src: './images/kiss.webp', alt: '' },
  ]
};

// ==========================================================
// 8. HÌNH ẢNH CHIIKAWA PHÂN THEO SECTION (Req 3)
//    Mỗi section nhận 2-3 Chiikawa phù hợp ngữ cảnh
// ==========================================================
export const HERO_CHIIKAWA = [
  { src: './images/chiikawa/usagi-1.gif', alt: 'Usagi nằm sấp' },
  { src: './images/chiikawa/lovechii.webp', alt: 'Chiikawa trái tim' },
];

export const SPACE_CHIIKAWA = [
  { src: './images/chiikawa/chii-5.gif', alt: 'Chiikawa suy nghĩ' },
  { src: './images/chiikawa/usagi-3.gif', alt: 'Usagi và Chiikawa nhảy' },
  { src: './images/chiikawa/hachi-1.gif', alt: 'Hachiware nhảy vui' },
];

export const SKY_CHIIKAWA = [
  { src: './images/chiikawa/chii-1.gif', alt: 'Chiikawa chạy' },
  { src: './images/chiikawa/chii-2.gif', alt: 'Chiikawa nhảy vui mừng' },
  { src: './images/chiikawa/hachi-2.gif', alt: 'Hachiware vẫy tay' },
];

export const GRASS_CHIIKAWA = [
  { src: './images/chiikawa/chii-3.gif', alt: 'Chiikawa vỗ tay' },
  { src: './images/chiikawa/chii-4.gif', alt: 'Chiikawa khóc dỗi' },
  { src: './images/chiikawa/usagi-2.gif', alt: 'Usagi lắc hông' },
];

export const OCEAN_CHIIKAWA = [
  { src: './images/chiikawa/usagi-1.gif', alt: 'Usagi nằm sấp' },
  { src: './images/chiikawa/usagi-3.gif', alt: 'Usagi và Chiikawa nhảy' },
  { src: './images/chiikawa/hachi-1.gif', alt: 'Hachiware nhảy vui' },
];

// Danh sách tổng để dùng cho gallery nếu cần
export const CHIIKAWA_IMAGES = [
  ...HERO_CHIIKAWA,
  ...SPACE_CHIIKAWA,
  ...SKY_CHIIKAWA,
  ...GRASS_CHIIKAWA,
  ...OCEAN_CHIIKAWA,
];

// ==========================================================
// 10. CẤU HÌNH TỐC ĐỘ VIDEO (Req 2)
//     Tự động phát, tăng tốc x10, ngoại trừ video 08/07/2026
// ==========================================================
export const VIDEO_SPEED_CONFIG = {
  defaultPlaybackRate: 10,
  exceptions: [ // video giữ tốc độ gốc
    './images/08072026/8.mp4',
    './images/08072026/10.mp4',
  ],
};

// ==========================================================
// 11. NỘI DUNG THƯ (DIGITAL LETTER)
// ==========================================================
export const LETTER_LINES = [
  "Gửi em, người con gái đặc biệt của anh,",
  "",
  "Anh vẫn nhớ như in ngày 07/08/2025 ấy, dòng tin nhắn đầu tiên em gửi đến.",
  "Lúc đó, anh chỉ nghĩ đó là một sự tình cờ...",
  "Nhưng rồi những dòng tin nhắn ngày một dài hơn,",
  "những câu chuyện không tên cứ thế kéo dài đến tận khuya.",
  "",
  "Từ hộp quà bưu điện em gửi, đến chiếc móc khóa nhỏ xinh,",
  "từ những ngại ngùng ban đầu, đến nụ cười rạng rỡ ở bốt chụp ảnh photobooth.",
  "Tất cả đã ghép lại thành một bức tranh kỷ niệm đẹp nhất mà anh từng có.",
  "",
  "Cảm ơn em vì đã đến, đã kiên nhẫn và đã chọn ở lại bên anh.",
  "365 ngày qua chỉ là sự khởi đầu.",
  "Tương lai phía trước, anh muốn được cùng em viết tiếp...",
  "",
  "Yêu em, kphun của anh."
];

// ==========================================================
// 12. CẤU HÌNH EMAILJS (ReplyBox)
// ==========================================================
export const EMAILJS_CONFIG = {
  publicKey: "j-6LlihUH6GNu_ZZC",
  serviceId: "service_mphulovekphun",
  templateId: "template_x4eqe3o",
  toEmail: "buiminhphu0@gmail.com"
};

// ==========================================================
// 13. DANH SÁCH HIỆU ỨNG ÂM THANH THEO NGỮ CẢNH (Req 13)
//     Đảm bảo tất cả SFX được ánh xạ đúng
// ==========================================================
export const SFX_MAP = {
  typing: './audio/sfx/typing-soft.mp3',
  ripple: './audio/sfx/water-ripple.mp3',
  bubble: './audio/sfx/bubble-pop.mp3',
  ambient: {
    space: './audio/ambient/space-hum.mp3',
    sky: './audio/ambient/sky-wind.mp3',
    grass: './audio/ambient/grass-rustling.mp3',
    ocean: './audio/ambient/ocean-waves.mp3',
  }
};

// ==========================================================
// 14. TỪ KHOÁ QUẢ CẦU 3D
// ==========================================================
export const WORD_SPHERE_TAGS = [
  "bíp bíp", "dễ thương", "đáng yêu", "chăm chỉ", "xinh đẹp", "cuti", "em bé", 
  "dợ iêu", "bé ngoan", "bé yêu", "bạn gái mphu", "ấm áp", "vẽ đẹp", "ngọt ngào", 
  "make my life better", "best girl friend", "be mine", "my love", "người anh iu nhất", 
  "only you", "my everything", "my muse", "silly", "bé mèo cam", "bún cá", 
  "em ieu", "love you forever"
];
