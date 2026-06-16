export interface TechReferenceSeed {
  title: string;
  client: string;
  description: string;
  url: string;
  category: string;
  sortOrder: number;
  logoSlug?: string;
  logoColor?: string;
}

export const TECH_REFERENCES: TechReferenceSeed[] = [
  { title: 'Google', client: 'Cloud & Arama', description: 'Cloud, Analytics ve reklam altyapısı entegrasyonları.', url: 'https://google.com', category: 'Teknoloji', sortOrder: 1, logoSlug: 'google', logoColor: '4285F4' },
  { title: 'Microsoft', client: 'Kurumsal Yazılım', description: 'Azure, Office 365 ve enterprise çözümler.', url: 'https://microsoft.com', category: 'Teknoloji', sortOrder: 2, logoSlug: 'microsoft', logoColor: '00A4EF' },
  { title: 'Apple', client: 'Ekosistem & Tasarım', description: 'Mobil-first deneyim ve premium UI standartları.', url: 'https://apple.com', category: 'Teknoloji', sortOrder: 3, logoSlug: 'apple', logoColor: 'FFFFFF' },
  { title: 'Amazon Web Services', client: 'Bulut Altyapı', description: 'Ölçeklenebilir cloud hosting ve DevOps.', url: 'https://aws.amazon.com', category: 'Altyapı', sortOrder: 4, logoSlug: 'amazon', logoColor: 'FF9900' },
  { title: 'Meta', client: 'Sosyal & Reklam', description: 'Facebook, Instagram reklam ve API entegrasyonları.', url: 'https://meta.com', category: 'Dijital Pazarlama', sortOrder: 5, logoSlug: 'meta', logoColor: '0866FF' },
  { title: 'Netflix', client: 'Medya Teknolojisi', description: 'Yüksek trafikli streaming mimarisi referansı.', url: 'https://netflix.com', category: 'Teknoloji', sortOrder: 6, logoSlug: 'netflix', logoColor: 'E50914' },
  { title: 'Spotify', client: 'Dijital Platform', description: 'Modern UX ve veri odaklı ürün geliştirme.', url: 'https://spotify.com', category: 'Teknoloji', sortOrder: 7, logoSlug: 'spotify', logoColor: '1DB954' },
  { title: 'Shopify', client: 'E-Ticaret', description: 'Online mağaza ve ödeme altyapısı çözümleri.', url: 'https://shopify.com', category: 'E-Ticaret', sortOrder: 8, logoSlug: 'shopify', logoColor: '7AB55C' },
  { title: 'Stripe', client: 'Ödeme Sistemleri', description: 'Global ödeme gateway ve abonelik yönetimi.', url: 'https://stripe.com', category: 'Fintech', sortOrder: 9, logoSlug: 'stripe', logoColor: '635BFF' },
  { title: 'Vercel', client: 'Web Altyapı', description: 'Next.js deployment ve edge network.', url: 'https://vercel.com', category: 'Altyapı', sortOrder: 10, logoSlug: 'vercel', logoColor: 'FFFFFF' },
  { title: 'OpenAI', client: 'Yapay Zeka', description: 'GPT tabanlı otomasyon ve chatbot entegrasyonları.', url: 'https://openai.com', category: 'Yapay Zeka', sortOrder: 11, logoSlug: 'openai', logoColor: 'FFFFFF' },
  { title: 'NVIDIA', client: 'AI & GPU', description: 'Yapay zeka ve yüksek performanslı hesaplama.', url: 'https://nvidia.com', category: 'Yapay Zeka', sortOrder: 12, logoSlug: 'nvidia', logoColor: '76B900' },
  { title: 'Adobe', client: 'Tasarım & Kreatif', description: 'Creative Cloud ve dijital içerik iş akışları.', url: 'https://adobe.com', category: 'Tasarım', sortOrder: 13, logoSlug: 'adobe', logoColor: 'FF0000' },
  { title: 'Salesforce', client: 'CRM', description: 'Müşteri ilişkileri yönetimi entegrasyonları.', url: 'https://salesforce.com', category: 'Kurumsal', sortOrder: 14, logoSlug: 'salesforce', logoColor: '00A1E0' },
  { title: 'Oracle', client: 'Veritabanı', description: 'Kurumsal veritabanı ve ERP çözümleri.', url: 'https://oracle.com', category: 'Kurumsal', sortOrder: 15, logoSlug: 'oracle', logoColor: 'F80000' },
  { title: 'IBM', client: 'Enterprise Tech', description: 'Kurumsal dönüşüm ve cloud hizmetleri.', url: 'https://ibm.com', category: 'Kurumsal', sortOrder: 16, logoSlug: 'ibm', logoColor: 'FFFFFF' },
  { title: 'Intel', client: 'Donanım & Cloud', description: 'Sunucu altyapısı ve performans optimizasyonu.', url: 'https://intel.com', category: 'Altyapı', sortOrder: 17, logoSlug: 'intel', logoColor: '0071C5' },
  { title: 'Samsung', client: 'Mobil & IoT', description: 'Mobil uyumluluk ve çok cihazlı deneyim.', url: 'https://samsung.com', category: 'Teknoloji', sortOrder: 18, logoSlug: 'samsung', logoColor: '1428A0' },
  { title: 'Tesla', client: 'İnovasyon', description: 'İleri teknoloji ve dijital dönüşüm vizyonu.', url: 'https://tesla.com', category: 'Teknoloji', sortOrder: 19, logoSlug: 'tesla', logoColor: 'CC0000' },
  { title: 'GitHub', client: 'Yazılım Geliştirme', description: 'Versiyon kontrol, CI/CD ve açık kaynak ekosistemi.', url: 'https://github.com', category: 'Yazılım', sortOrder: 20, logoSlug: 'github', logoColor: 'FFFFFF' },
];

export function buildLogoUrl(slug: string, color: string): string {
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}
