export type BlogContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string };

export interface BlogSeedPost {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tagSlugs: string[];
  readMinutes: number;
  accent: 'cyan' | 'gold' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo';
  blocks: BlogContentBlock[];
}

export const BLOG_CATEGORIES = [
  { slug: 'web-gelistirme', name: 'Web Geliştirme', description: 'Modern web teknolojileri ve altyapılar' },
  { slug: 'e-ticaret', name: 'E-Ticaret', description: 'Online satış platformları ve ödeme sistemleri' },
  { slug: 'ui-ux', name: 'UI/UX', description: 'Tasarım araçları ve kullanıcı deneyimi' },
  { slug: 'yapay-zeka', name: 'Yapay Zeka', description: 'AI otomasyon ve LLM altyapıları' },
  { slug: 'dijital-pazarlama', name: 'Dijital Pazarlama', description: 'SEO, reklam ve büyüme stratejileri' },
  { slug: 'altyapi', name: 'Altyapı', description: 'Cloud, hosting ve DevOps' },
  { slug: 'sosyal-medya', name: 'Sosyal Medya', description: 'İçerik üretimi ve platform stratejileri' },
];

export const BLOG_TAGS = [
  { slug: 'nextjs', name: 'Next.js' },
  { slug: 'vercel', name: 'Vercel' },
  { slug: 'react', name: 'React' },
  { slug: 'shopify', name: 'Shopify' },
  { slug: 'woocommerce', name: 'WooCommerce' },
  { slug: 'figma', name: 'Figma' },
  { slug: 'aws', name: 'AWS' },
  { slug: 'google-cloud', name: 'Google Cloud' },
  { slug: 'openai', name: 'OpenAI' },
  { slug: 'groq', name: 'Groq' },
  { slug: 'google-ads', name: 'Google Ads' },
  { slug: 'meta-ads', name: 'Meta Ads' },
  { slug: 'stripe', name: 'Stripe' },
  { slug: 'nestjs', name: 'NestJS' },
  { slug: 'seo', name: 'SEO' },
  { slug: 'tiktok', name: 'TikTok' },
  { slug: 'instagram', name: 'Instagram' },
];

export const BLOG_POSTS: BlogSeedPost[] = [
  {
    slug: 'nextjs-vercel-modern-web-gelistirme',
    title: 'Next.js ve Vercel: Modern Web Geliştirmenin Altın Standardı',
    excerpt:
      'Netflix, TikTok ve Nike gibi dev markaların tercih ettiği Next.js + Vercel ikilisi, performans ve ölçeklenebilirlikte neden öne çıkıyor?',
    categorySlug: 'web-gelistirme',
    tagSlugs: ['nextjs', 'vercel', 'react'],
    readMinutes: 6,
    accent: 'cyan',
    blocks: [
      { type: 'paragraph', text: 'Günümüzde kurumsal web projelerinde hız, SEO ve geliştirici deneyimi bir arada düşünülüyor. Next.js, React ekosisteminin en olgun framework\'lerinden biri olarak App Router, Server Components ve edge rendering ile bu üçlüyü tek çatı altında topluyor.' },
      { type: 'heading', level: 2, text: 'Neden Next.js?' },
      { type: 'list', items: ['Sunucu tarafı render (SSR) ve statik üretim (SSG) esnekliği', 'Otomatik kod bölme ve görsel optimizasyonu', 'Core Web Vitals için yerleşik performans araçları', 'API Routes ile full-stack geliştirme imkânı'] },
      { type: 'heading', level: 2, text: 'Vercel Altyapısının Rolü' },
      { type: 'paragraph', text: 'Vercel, Next.js\'in yaratıcıları tarafından geliştirilen edge-first bir hosting platformudur. Global CDN, otomatik SSL, preview deployment ve serverless fonksiyonlar sayesinde DevOps yükünü ciddi ölçüde azaltır.' },
      { type: 'quote', text: 'Performans artık lüks değil — dönüşüm oranlarını doğrudan etkileyen bir satış metriğidir.' },
      { type: 'paragraph', text: 'DNZMEDYA olarak kurumsal web projelerinde Next.js + Vercel kombinasyonunu; hızlı time-to-market, güçlü SEO altyapısı ve düşük operasyon maliyeti için varsayılan stack olarak konumlandırıyoruz.' },
    ],
  },
  {
    slug: 'shopify-woocommerce-e-ticaret-karsilastirma',
    title: 'Shopify vs WooCommerce: E-Ticaret Devlerinin Karşılaştırması',
    excerpt:
      'Gymshark ve Allbirds gibi global markalar Shopify\'ı tercih ederken, WooCommerce WordPress ekosisteminde esneklik sunuyor. Hangisi sizin için doğru?',
    categorySlug: 'e-ticaret',
    tagSlugs: ['shopify', 'woocommerce'],
    readMinutes: 7,
    accent: 'amber',
    blocks: [
      { type: 'paragraph', text: 'E-ticaret platformu seçimi; bütçe, teknik kapasite, ölçeklenebilirlik ve entegrasyon ihtiyaçlarına göre yapılmalıdır. Piyasadaki iki dominant çözüm Shopify ve WooCommerce farklı iş modellerine hitap eder.' },
      { type: 'heading', level: 2, text: 'Shopify: Hızlı Başlangıç, Yönetilen Altyapı' },
      { type: 'list', items: ['Aylık abonelik modeli, teknik bakım minimum', 'Shopify Payments ve 100+ ödeme entegrasyonu', 'App Store ile genişletilebilir ekosistem', 'Black Friday trafiğinde kanıtlanmış ölçeklenebilirlik'] },
      { type: 'heading', level: 2, text: 'WooCommerce: Esneklik ve Özelleştirme' },
      { type: 'paragraph', text: 'WordPress tabanlı WooCommerce, açık kaynak yapısı sayesinde sınırsız özelleştirme imkânı sunar. Hosting ve güvenlik sorumluluğu sizde olsa da, maliyet kontrolü ve veri sahipliği açısından avantajlıdır.' },
      { type: 'quote', text: 'Doğru platform; ürün kataloğunuzdan değil, büyüme hedefinizden ve operasyonel kapasitenizden doğar.' },
    ],
  },
  {
    slug: 'figma-ui-ux-tasarim-standardi',
    title: 'Figma: UI/UX Tasarımında Endüstri Standardı Nasıl Oluştu?',
    excerpt:
      'Spotify, Airbnb ve Microsoft tasarım ekipleri Figma ile iş birliğini merkeze alıyor. Bulut tabanlı tasarımın ajans süreçlerine etkisi.',
    categorySlug: 'ui-ux',
    tagSlugs: ['figma'],
    readMinutes: 5,
    accent: 'violet',
    blocks: [
      { type: 'paragraph', text: 'Figma, tarayıcı tabanlı çalışması ve gerçek zamanlı iş birliği özellikleriyle UI/UX tasarımını demokratikleştirdi. Design system, component library ve prototype akışları tek platformda birleşti.' },
      { type: 'heading', level: 2, text: 'Ajans Süreçlerinde Figma' },
      { type: 'list', items: ['Müşteri onay döngülerini hızlandıran canlı prototype', 'Developer handoff ile pixel-perfect uygulama', 'Design token\'lar ile tutarlı marka dili', 'FigJam ile beyin fırtınası ve user flow haritalama'] },
      { type: 'paragraph', text: 'DNZMEDYA\'da her web projesi Figma\'da başlar: wireframe → UI kit → interactive prototype → geliştirme. Bu akış, revizyon maliyetini düşürür ve teslim kalitesini artırır.' },
    ],
  },
  {
    slug: 'aws-google-cloud-bulut-altyapi',
    title: 'AWS ve Google Cloud: Bulut Altyapısında İki Dev',
    excerpt:
      'Netflix AWS üzerinde, Spotify Google Cloud\'da milyarlarca istek işliyor. Kurumsal projeler için bulut seçimi rehberi.',
    categorySlug: 'altyapi',
    tagSlugs: ['aws', 'google-cloud'],
    readMinutes: 6,
    accent: 'indigo',
    blocks: [
      { type: 'paragraph', text: 'Bulut bilişim, modern web uygulamalarının bel kemiğidir. Amazon Web Services (AWS) pazar liderliğini sürdürürken, Google Cloud Platform (GCP) veri analitiği ve Kubernetes alanında güçlü bir alternatif sunuyor.' },
      { type: 'heading', level: 2, text: 'AWS Güçlü Yönleri' },
      { type: 'list', items: ['EC2, Lambda, S3 ile kapsamlı servis yelpazesi', 'Global 30+ bölge, yüksek erişilebilirlik', 'RDS, DynamoDB ile yönetilen veritabanları', 'Enterprise düzeyinde güvenlik sertifikaları'] },
      { type: 'heading', level: 2, text: 'Google Cloud Farkı' },
      { type: 'paragraph', text: 'GCP; BigQuery, Kubernetes Engine (GKE) ve AI/ML servisleriyle veri odaklı projelerde öne çıkar. Firebase entegrasyonu mobil ve web projeleri için hızlı MVP imkânı sağlar.' },
      { type: 'quote', text: 'Doğru bulut stratejisi; maliyet, performans ve ekibinizin uzmanlık alanının kesişim noktasıdır.' },
    ],
  },
  {
    slug: 'openai-groq-yapay-zeka-otomasyon',
    title: 'OpenAI ve Groq: Yapay Zeka Otomasyonunun Yeni Çağı',
    excerpt:
      'ChatGPT, GitHub Copilot ve Groq\'un ultra hızlı inference altyapısı iş süreçlerini nasıl dönüştürüyor?',
    categorySlug: 'yapay-zeka',
    tagSlugs: ['openai', 'groq'],
    readMinutes: 6,
    accent: 'sky',
    blocks: [
      { type: 'paragraph', text: 'Yapay zeka artık yalnızca araştırma laboratuvarlarında değil; müşteri hizmetleri, içerik üretimi ve yazılım geliştirmede aktif kullanılıyor. OpenAI GPT modelleri ve Groq LPU altyapısı bu dönüşümün iki kritik ayağı.' },
      { type: 'heading', level: 2, text: 'OpenAI Ekosistemi' },
      { type: 'list', items: ['GPT-4o ile çok modlu (metin, görsel) anlama', 'API ile chatbot, asistan ve otomasyon entegrasyonu', 'Embeddings ile semantik arama ve bilgi tabanı', 'Function calling ile CRM/ERP bağlantıları'] },
      { type: 'heading', level: 2, text: 'Groq: Hız Odaklı Inference' },
      { type: 'paragraph', text: 'Groq, Llama ve Mixtral modellerini milisaniye düzeyinde yanıt süreleriyle sunar. DNZ Asistan gibi gerçek zamanlı sohbet uygulamaları için ideal, maliyet-etkin bir alternatiftir.' },
      { type: 'quote', text: 'AI otomasyonu doğru kurgulandığında 7/24 çalışan, yorulmayan bir ekip üyesi gibidir.' },
    ],
  },
  {
    slug: 'google-ads-meta-ads-dijital-pazarlama',
    title: 'Google Ads ve Meta Ads: Dijital Pazarlamada Çift Güç',
    excerpt:
      'Arama niyetini Google, sosyal keşfi Meta platformları yakalıyor. ROI odaklı reklam stratejisi nasıl kurulur?',
    categorySlug: 'dijital-pazarlama',
    tagSlugs: ['google-ads', 'meta-ads', 'seo'],
    readMinutes: 7,
    accent: 'emerald',
    blocks: [
      { type: 'paragraph', text: 'Dijital reklamcılıkta Google Ads arama niyetini, Meta Ads (Facebook & Instagram) ise ilgi alanı ve davranışsal hedeflemeyi domine eder. Başarılı kampanyalar bu iki kanalı birbirini tamamlayacak şekilde kurgular.' },
      { type: 'heading', level: 2, text: 'Google Ads Best Practice' },
      { type: 'list', items: ['Performance Max ve arama ağı kampanya yapısı', 'Dönüşüm izleme (GA4 + Tag Manager)', 'Negatif anahtar kelime optimizasyonu', 'Landing page hızı ile Quality Score ilişkisi'] },
      { type: 'heading', level: 2, text: 'Meta Ads Stratejisi' },
      { type: 'paragraph', text: 'Reels ve Stories formatları organik etkileşimin yanı sıra reklam performansında da kritik. Pixel ve Conversions API (CAPI) ile iOS sonrası dönemde doğru attribution sağlanır.' },
    ],
  },
  {
    slug: 'nestjs-nodejs-ozel-yazilim-mimarisi',
    title: 'NestJS ve Node.js: Özel Yazılım Projelerinde Sağlam Mimari',
    excerpt:
      'Enterprise düzeyinde modüler backend geliştirme: TypeScript, dependency injection ve mikro servis hazırlığı.',
    categorySlug: 'web-gelistirme',
    tagSlugs: ['nestjs', 'react'],
    readMinutes: 5,
    accent: 'cyan',
    blocks: [
      { type: 'paragraph', text: 'NestJS, Angular\'dan ilham alan modüler yapısıyla Node.js ekosisteminde enterprise backend standardı haline geldi. DNZMEDYA platformunun API katmanı da NestJS üzerine inşa edilmiştir.' },
      { type: 'heading', level: 2, text: 'Mimari Avantajlar' },
      { type: 'list', items: ['Modül bazlı ölçeklenebilir kod organizasyonu', 'Prisma ORM ile tip-güvenli veritabanı erişimi', 'JWT + RBAC ile kurumsal güvenlik', 'Swagger ile otomatik API dokümantasyonu'] },
      { type: 'quote', text: 'İyi tasarlanmış bir API, frontend\'den bağımsız olarak iş mantığınızı korur ve gelecekteki entegrasyonlara kapı açar.' },
    ],
  },
  {
    slug: 'stripe-odeme-altyapilari-e-ticaret',
    title: 'Stripe ve Modern Ödeme Altyapıları: E-Ticarette Güven',
    excerpt:
      'Amazon, Shopify ve binlerce SaaS şirketi Stripe ile ödeme alıyor. PCI uyumluluğu ve global ödeme yöntemleri.',
    categorySlug: 'e-ticaret',
    tagSlugs: ['stripe', 'shopify'],
    readMinutes: 5,
    accent: 'gold',
    blocks: [
      { type: 'paragraph', text: 'Ödeme altyapısı e-ticaretin en kritik bileşenidir. Stripe; developer-first API\'si, 135+ para birimi desteği ve Apple Pay / Google Pay entegrasyonu ile global standart oluşturdu.' },
      { type: 'heading', level: 2, text: 'Stripe Neden Tercih Ediliyor?' },
      { type: 'list', items: ['Tek entegrasyonla kart, cüzdan ve BNPL ödemeleri', 'Radar ile AI destekli fraud koruması', 'Subscription billing ile tekrarlayan gelir modelleri', 'Checkout hosted sayfası ile hızlı go-live'] },
      { type: 'paragraph', text: 'Türkiye\'de yerel ödeme sağlayıcıları (iyzico, PayTR) ile Stripe\'ın hibrit kullanımı, hem global hem yerel müşterilere hitap eden projelerde sık tercih edilir.' },
    ],
  },
  {
    slug: 'instagram-tiktok-sosyal-medya-icerik',
    title: 'Instagram ve TikTok: 2026 Sosyal Medya İçerik Stratejisi',
    excerpt:
      'Kısa video içeriği marka bilinirliğini nasıl katlıyor? Reels, TikTok ve UGC trendleri.',
    categorySlug: 'sosyal-medya',
    tagSlugs: ['instagram', 'tiktok'],
    readMinutes: 6,
    accent: 'rose',
    blocks: [
      { type: 'paragraph', text: 'Sosyal medya algoritmaları 2026\'da kısa videoyu önceliklendirmeye devam ediyor. Instagram Reels ve TikTok, markaların organik erişim elde etmesinin en güçlü kanalları arasında.' },
      { type: 'heading', level: 2, text: 'İçerik Formatları' },
      { type: 'list', items: ['15-60 saniyelik hook odaklı Reels', 'Behind-the-scenes ve UGC kampanyaları', 'Carousel postlar ile eğitim içeriği', 'Canlı yayın ve interaktif sticker\'lar'] },
      { type: 'heading', level: 2, text: 'Ölçümleme' },
      { type: 'paragraph', text: 'Erişim ve etkileşim metriklerinin yanı sıra profil ziyareti, link tıklaması ve DM dönüşümleri ROI hesabında değerlendirilmelidir. Meta Business Suite ve TikTok Analytics bu verileri merkezi sunar.' },
    ],
  },
  {
    slug: 'seo-teknik-optimizasyon-rehberi',
    title: 'Teknik SEO Rehberi: Google\'ın Sevdiği Web Siteleri Nasıl İnşa Edilir?',
    excerpt:
      'Core Web Vitals, schema markup ve crawl budget — organik trafikte kalıcı büyümenin temelleri.',
    categorySlug: 'dijital-pazarlama',
    tagSlugs: ['seo', 'nextjs'],
    readMinutes: 8,
    accent: 'emerald',
    blocks: [
      { type: 'paragraph', text: 'SEO yalnızca anahtar kelime yazmak değildir. Teknik SEO; sitenizin Googlebot tarafından verimli taranması, hızlı indekslenmesi ve kullanıcı deneyimi sinyallerinin optimize edilmesidir.' },
      { type: 'heading', level: 2, text: 'Core Web Vitals' },
      { type: 'list', items: ['LCP (Largest Contentful Paint) < 2.5s', 'INP (Interaction to Next Paint) < 200ms', 'CLS (Cumulative Layout Shift) < 0.1', 'Next.js Image ve font optimizasyonu'] },
      { type: 'heading', level: 2, text: 'Yapısal Veri ve Schema' },
      { type: 'paragraph', text: 'Organization, Article, FAQ ve Product schema markup\'ları arama sonuçlarında zengin snippet görünürlüğü sağlar. JSON-LD formatı Google\'ın önerdiği standarttır.' },
      { type: 'quote', text: 'Teknik SEO bir kez doğru yapıldığında, içerik pazarlamasının etkisini katlayarak büyütür.' },
    ],
  },
];

export function blocksToContent(blocks: BlogContentBlock[]) {
  return { blocks };
}
