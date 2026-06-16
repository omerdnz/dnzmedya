export interface ServiceSeed {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  accent: string;
  sortOrder: number;
  isFeatured?: boolean;
}

export const PREMIUM_SERVICES: ServiceSeed[] = [
  {
    slug: 'web',
    title: 'Web Tasarım ve Web Geliştirme',
    subtitle: 'Hızlı, modern, dönüşüm odaklı',
    description:
      'Markanızı dijitalde temsil eden, hızlı yüklenen ve her cihazda kusursuz çalışan kurumsal web siteleri tasarlıyor ve geliştiriyoruz.',
    highlights: [
      'Next.js & React tabanlı modern mimari',
      'Mobil öncelikli responsive tasarım',
      'Core Web Vitals optimizasyonu',
      'CMS entegrasyonu ve kolay yönetim',
    ],
    accent: 'cyan',
    sortOrder: 1,
    isFeatured: true,
  },
  {
    slug: 'uiux',
    title: 'UI/UX Tasarım',
    subtitle: 'Kullanıcı deneyimi odaklı arayüzler',
    description:
      'Kullanıcı araştırması, wireframe ve prototiplemeden pixel-perfect arayüze kadar uçtan uca deneyim tasarımı sunuyoruz.',
    highlights: [
      'Kullanıcı akışı ve wireframe',
      'Figma prototip & design system',
      'Erişilebilirlik (WCAG) standartları',
      'A/B test ve iterasyon desteği',
    ],
    accent: 'violet',
    sortOrder: 2,
    isFeatured: true,
  },
  {
    slug: 'ecommerce',
    title: 'E-Ticaret Sistemleri',
    subtitle: 'Satışa hazır online mağazalar',
    description:
      'Güvenli ödeme, stok yönetimi ve ölçeklenebilir altyapı ile e-ticaret sitenizi kuruyor, büyümenize eşlik ediyoruz.',
    highlights: [
      'Ödeme & kargo entegrasyonları',
      'Ürün ve stok yönetimi',
      'Dönüşüm optimizasyonu (CRO)',
      'Pazaryeri & çok kanallı satış',
    ],
    accent: 'amber',
    sortOrder: 3,
    isFeatured: true,
  },
  {
    slug: 'software',
    title: 'Özel Yazılım Geliştirme',
    subtitle: 'İşinize özel dijital çözümler',
    description:
      'CRM, panel, otomasyon ve sektöre özel yazılımlar geliştirerek operasyonel verimliliğinizi artırıyoruz.',
    highlights: [
      'API & mikro servis mimarisi',
      'Veritabanı tasarımı ve güvenlik',
      'Admin panel & raporlama',
      'Bakım ve sürekli geliştirme',
    ],
    accent: 'indigo',
    sortOrder: 4,
    isFeatured: true,
  },
  {
    slug: 'branding',
    title: 'Marka Kimliği ve Logo Tasarımı',
    subtitle: 'Akılda kalıcı marka imajı',
    description:
      'Logo, renk paleti, tipografi ve marka kılavuzunuzla tutarlı, profesyonel bir kurumsal kimlik oluşturuyoruz.',
    highlights: [
      'Logo & alternatif kullanımlar',
      'Renk, font ve görsel dil',
      'Kurumsal kimlik kılavuzu',
      'Sosyal medya & baskı uyarlamaları',
    ],
    accent: 'gold',
    sortOrder: 5,
    isFeatured: true,
  },
  {
    slug: 'social',
    title: 'Sosyal Medya Yönetimi ve İçerik Üretimi',
    subtitle: 'Markanızı sosyalde büyütün',
    description:
      'Strateji, içerik planı, görsel üretim ve topluluk yönetimi ile sosyal medyada güçlü bir marka varlığı kuruyoruz.',
    highlights: [
      'Platform bazlı içerik stratejisi',
      'Görsel & metin içerik üretimi',
      'Reklam ve organik büyüme',
      'Aylık performans raporları',
    ],
    accent: 'rose',
    sortOrder: 6,
    isFeatured: true,
  },
  {
    slug: 'video',
    title: 'Video Edit ve Motion Graphics',
    subtitle: 'Hareketli, etkileyici hikâyeler',
    description:
      'Tanıtım videoları, motion graphics ve reels içerikleri ile markanızın mesajını görsel olarak güçlendiriyoruz.',
    highlights: [
      'Kurumsal tanıtım videoları',
      'Motion graphics & animasyon',
      'Sosyal medya video formatları',
      'Color grading & ses miksajı',
    ],
    accent: 'fuchsia',
    sortOrder: 7,
  },
  {
    slug: 'seo',
    title: 'SEO ve Dijital Pazarlama',
    subtitle: 'Organik görünürlük & ROI',
    description:
      'Arama motoru optimizasyonu, Google Ads ve performans pazarlaması ile hedef kitlenize ölçülebilir şekilde ulaşıyoruz.',
    highlights: [
      'Teknik & içerik SEO',
      'Google Ads & Meta reklamları',
      'Anahtar kelime & rakip analizi',
      'Dönüşüm takibi & raporlama',
    ],
    accent: 'emerald',
    sortOrder: 8,
  },
  {
    slug: 'ai',
    title: 'Yapay Zeka Otomasyon Sistemleri',
    subtitle: 'Akıllı iş akışları',
    description:
      'AI destekli chatbot, içerik otomasyonu ve iş süreçlerinizi hızlandıran akıllı entegrasyonlar geliştiriyoruz.',
    highlights: [
      'AI chatbot & asistan entegrasyonu',
      'İçerik & veri otomasyonu',
      'CRM & e-posta otomasyonları',
      'LLM API entegrasyonları',
    ],
    accent: 'sky',
    sortOrder: 9,
  },
  {
    slug: 'hosting',
    title: 'Hosting ve Sunucu Altyapı Hizmetleri',
    subtitle: 'Güvenli, hızlı altyapı',
    description:
      'Sunucu kurulumu, SSL, yedekleme ve izleme ile projelerinizin kesintisiz ve güvenli çalışmasını sağlıyoruz.',
    highlights: [
      'Cloud & VPS yapılandırması',
      'SSL, CDN & DNS yönetimi',
      'Otomatik yedekleme',
      '7/24 uptime izleme',
    ],
    accent: 'teal',
    sortOrder: 10,
  },
];
