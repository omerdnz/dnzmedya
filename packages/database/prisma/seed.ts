import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BLOG_CATEGORIES, BLOG_POSTS, BLOG_TAGS, blocksToContent } from './blog-seed-data';
import { TECH_REFERENCES, buildLogoUrl } from './references-seed-data';
import { PREMIUM_SERVICES } from './services-seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DNZMEDYA database...');

  // ─── Permissions ───
  const modules = [
    'dashboard', 'pages', 'blog', 'services', 'scripts', 'references',
    'media', 'seo', 'crm', 'quotes', 'forms', 'reports', 'users', 'settings', 'system',
  ];
  const actions = ['create', 'read', 'update', 'delete'];

  const permissions = [];
  for (const mod of modules) {
    for (const action of actions) {
      permissions.push({
        name: `${mod}.${action}`,
        slug: `${mod}.${action}`,
        module: mod,
        action,
      });
    }
  }

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    });
  }

  // ─── Roles ───
  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      description: 'Tam yetkili yönetici',
      isSystem: true,
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { slug: 'editor' },
    update: {},
    create: {
      name: 'Editör',
      slug: 'editor',
      description: 'İçerik yönetimi yetkisi',
      isSystem: true,
    },
  });

  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  const editorModules = ['dashboard', 'pages', 'blog', 'services', 'scripts', 'references', 'media', 'seo', 'forms'];
  for (const perm of allPermissions.filter((p) => editorModules.includes(p.module))) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: editorRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: editorRole.id, permissionId: perm.id },
    });
  }

  // ─── Admin User ───
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@dnzmedya.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Admin',
      lastName: 'DNZMEDYA',
      roleId: adminRole.id,
    },
  });

  // ─── Site Settings ───
  const settings = [
    { group: 'site', key: 'title', value: 'DNZMEDYA | Yazılım, SEO ve Dijital Reklam Ajansı' },
    { group: 'site', key: 'description', value: 'DNZMEDYA, proje bazlı web yazılım geliştirme, kurumsal web sitesi tasarımı, e-ticaret çözümleri, SEO, dijital reklam yönetimi ve bilgi teknolojileri danışmanlığı alanlarında profesyonel hizmetler sunan yenilikçi bir dijital çözüm ortağıdır.' },
    { group: 'site', key: 'phone', value: '0 533 616 94 84' },
    { group: 'site', key: 'phoneLink', value: 'tel:+905336169484' },
    { group: 'site', key: 'email', value: 'omerdeniz07@gmail.com' },
    { group: 'site', key: 'address', value: 'Muratpaşa, Antalya, TR' },
    { group: 'site', key: 'copyright', value: "© Tüm Telif Hakları 2026 DNZMEDYA'ya aittir" },
    { group: 'social', key: 'facebook', value: '#' },
    { group: 'social', key: 'twitter', value: '#' },
    { group: 'social', key: 'youtube', value: '#' },
    { group: 'social', key: 'linkedin', value: '#' },
    { group: 'social', key: 'instagram', value: '#' },
    { group: 'theme', key: 'primaryColor', value: '#D4AF37' },
    { group: 'theme', key: 'accentColor', value: '#00CED1' },
    { group: 'theme', key: 'darkMode', value: true },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { group_key: { group: setting.group, key: setting.key } },
      update: { value: setting.value },
      create: setting,
    });
  }

  // ─── Hero ───
  await prisma.hero.deleteMany();
  await prisma.hero.create({
    data: {
      title: 'dijital düşün',
      subtitle: 'Dijital Ajans',
      description: 'Fikirden projeye, projeden başarıya; dijitalde büyümek isteyen markalar için yenilikçi çözümler geliştiriyoruz.',
      ctaText: 'Hemen İletişime Geçin',
      ctaUrl: '/iletisim',
      secondaryCtaText: 'Teklif Al',
      secondaryCtaUrl: '/teklif-al',
      animationType: 'parallax',
      counterValue: 150,
      counterLabel: 'Tamamlanan Proje',
      isActive: true,
    },
  });

  // ─── Services (Hizmetler sayfası + ana sayfa) ───
  const serviceSlugs = PREMIUM_SERVICES.map((s) => s.slug);
  for (const svc of PREMIUM_SERVICES) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        title: svc.title,
        subtitle: svc.subtitle,
        description: svc.description,
        features: svc.highlights,
        content: { accent: svc.accent },
        sortOrder: svc.sortOrder,
        isFeatured: svc.isFeatured ?? false,
        isPublished: true,
      },
      create: {
        slug: svc.slug,
        title: svc.title,
        subtitle: svc.subtitle,
        description: svc.description,
        features: svc.highlights,
        content: { accent: svc.accent },
        sortOrder: svc.sortOrder,
        isFeatured: svc.isFeatured ?? false,
        isPublished: true,
      },
    });
  }
  await prisma.service.updateMany({
    where: { slug: { notIn: serviceSlugs } },
    data: { isPublished: false },
  });

  // ─── FAQs ───
  const faqs = [
    {
      question: 'DNZMEDYA hangi hizmetleri sunuyor?',
      answer:
        'DNZMEDYA; kurumsal web sitesi tasarımı ve geliştirme, e-ticaret çözümleri, SEO (arama motoru optimizasyonu), Google Ads yönetimi, sosyal medya yönetimi, özel yazılım geliştirme ve hazır web scriptleri sunar. Proje bazlı çalışarak markanızın ihtiyacına göre uçtan uca dijital çözümler üretiriz.',
      category: 'genel',
      sortOrder: 1,
    },
    {
      question: 'Proje süreci nasıl işliyor?',
      answer:
        'Süreç; ihtiyaç analizi ve keşif görüşmesi ile başlar. Ardından kapsam, takvim ve bütçeyi içeren teklif hazırlanır. Onay sonrası tasarım, geliştirme, test ve yayına alma aşamaları ilerler. Teslimde eğitim ve dokümantasyon sağlanır; proje boyunca düzenli bilgilendirme yapılır.',
      category: 'genel',
      sortOrder: 2,
    },
    {
      question: 'Fiyatlandırma nasıl yapılıyor?',
      answer:
        'Her proje farklı kapsam, süre ve teknik gereksinimlere sahip olduğu için sabit paket fiyatı yerine ihtiyaca özel teklif sunuyoruz. İlk görüşme ve ön değerlendirme ücretsizdir. Detaylı teklif için sitemizdeki Teklif Al formunu doldurabilir veya bizi arayabilirsiniz.',
      category: 'genel',
      sortOrder: 3,
    },
    {
      question: 'Bir web sitesi projesi ne kadar sürede tamamlanır?',
      answer:
        'Süre projenin kapsamına göre değişir. Kurumsal tanıtım siteleri genellikle 2–4 hafta, e-ticaret ve özel yazılım projeleri 4–8 hafta veya daha uzun sürebilir. Keşif görüşmesi sonrası size net bir teslim takvimi paylaşılır.',
      category: 'genel',
      sortOrder: 4,
    },
    {
      question: 'SEO hizmetiniz neleri kapsıyor?',
      answer:
        'Teknik SEO denetimi, site hızı ve mobil uyumluluk iyileştirmeleri, anahtar kelime araştırması, meta ve içerik optimizasyonu, iç link yapısı, Google Search Console / Analytics kurulumu ve düzenli performans raporlaması sunuyoruz. Hedefimiz organik görünürlüğünüzü kalıcı şekilde artırmaktır.',
      category: 'hizmet',
      sortOrder: 5,
    },
    {
      question: 'Proje tesliminden sonra destek veriyor musunuz?',
      answer:
        'Evet. Tüm projelerimizde teslim sonrası teknik destek sağlıyoruz. İsteğe bağlı bakım, güvenlik güncellemesi, yedekleme ve içerik güncelleme paketleri ile sitenizin kesintisiz çalışmasına devam edebilirsiniz.',
      category: 'genel',
      sortOrder: 6,
    },
    {
      question: 'Hazır scriptler nedir, nasıl satın alabilirim?',
      answer:
        'Hazır scriptler; hızlı devreye alınabilen, özelleştirilebilir web yazılım çözümleridir. Sitemizdeki Hazır Scriptler sayfasından mevcut ürünleri inceleyebilir, detay ve fiyat bilgisi için bizimle iletişime geçebilirsiniz.',
      category: 'hizmet',
      sortOrder: 7,
    },
    {
      question: 'Sadece Antalya’daki firmalara mı hizmet veriyorsunuz?',
      answer:
        'Hayır. Merkezimiz Antalya (Muratpaşa) olsa da Türkiye genelinde ve yurt dışındaki müşterilere uzaktan hizmet veriyoruz. Görüşmeler online yapılabilir; proje yönetimi dijital araçlarla yürütülür.',
      category: 'genel',
      sortOrder: 8,
    },
    {
      question: 'Teklif almak için ne yapmam gerekiyor?',
      answer:
        'Sitemizdeki /teklif-al sayfasından proje detaylarınızı iletebilir, iletişim formunu doldurabilir veya doğrudan 0 533 616 94 84 numarasından / omerdeniz07@gmail.com adresinden bize ulaşabilirsiniz. En kısa sürede size dönüş yapılır.',
      category: 'genel',
      sortOrder: 9,
    },
    {
      question: 'Hangi teknolojileri kullanıyorsunuz?',
      answer:
        'Modern ve ölçeklenebilir teknolojiler tercih ediyoruz: React, Next.js, TypeScript, Node.js/NestJS, Tailwind CSS ve güncel SEO/analytics araçları. Proje ihtiyacına göre e-ticaret altyapıları, veritabanı çözümleri ve bulut tabanlı deployment seçenekleri değerlendirilir.',
      category: 'teknik',
      sortOrder: 10,
    },
  ];

  await prisma.faq.deleteMany();
  for (const faq of faqs) {
    await prisma.faq.create({
      data: { ...faq, isPublished: true },
    });
  }

  // ─── Blog Categories & Tags ───
  for (const cat of BLOG_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }

  for (const tag of BLOG_TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }

  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (adminUser) {
    const categoryMap = Object.fromEntries(
      (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
    );
    const tagMap = Object.fromEntries((await prisma.tag.findMany()).map((t) => [t.slug, t.id]));

    for (const [index, post] of BLOG_POSTS.entries()) {
      const publishedAt = new Date(Date.now() - index * 86400000 * 3);

      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: blocksToContent(post.blocks),
          status: 'PUBLISHED',
          publishedAt,
          categories: {
            set: [{ id: categoryMap[post.categorySlug] }],
          },
          tags: {
            set: post.tagSlugs.map((s) => ({ id: tagMap[s] })),
          },
        },
        create: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: blocksToContent(post.blocks),
          status: 'PUBLISHED',
          publishedAt,
          authorId: adminUser.id,
          viewCount: Math.floor(Math.random() * 400) + 50,
          categories: {
            connect: [{ id: categoryMap[post.categorySlug] }],
          },
          tags: {
            connect: post.tagSlugs.map((s) => ({ id: tagMap[s] })),
          },
        },
      });
    }
  }

  // ─── Tech References ───
  await prisma.reference.deleteMany();
  for (const ref of TECH_REFERENCES) {
    await prisma.reference.create({
      data: {
        title: ref.title,
        client: ref.client,
        description: ref.description,
        url: ref.url,
        category: ref.category,
        sortOrder: ref.sortOrder,
        logoSlug: ref.logoSlug,
        logoUrl: ref.logoSlug && ref.logoColor ? buildLogoUrl(ref.logoSlug, ref.logoColor) : undefined,
        isPublished: true,
      },
    });
  }

  // ─── Forms ───
  await prisma.form.upsert({
    where: { slug: 'contact' },
    update: {},
    create: {
      slug: 'contact',
      name: 'İletişim Formu',
      description: 'Genel iletişim formu',
      fields: [
        { name: 'name', label: 'Ad Soyad', type: 'text', required: true },
        { name: 'email', label: 'E-posta', type: 'email', required: true },
        { name: 'phone', label: 'Telefon', type: 'tel', required: false },
        { name: 'subject', label: 'Konu', type: 'text', required: true },
        { name: 'message', label: 'Mesaj', type: 'textarea', required: true },
      ],
    },
  });

  await prisma.form.upsert({
    where: { slug: 'quote-request' },
    update: {},
    create: {
      slug: 'quote-request',
      name: 'Teklif Talep Formu',
      description: 'Proje teklifi talep formu',
      fields: [
        { name: 'name', label: 'Ad Soyad', type: 'text', required: true },
        { name: 'email', label: 'E-posta', type: 'email', required: true },
        { name: 'phone', label: 'Telefon', type: 'tel', required: true },
        { name: 'company', label: 'Şirket', type: 'text', required: false },
        { name: 'service', label: 'Hizmet', type: 'select', required: true, options: ['Web Tasarım', 'SEO', 'Google Ads', 'E-Ticaret', 'Sosyal Medya', 'Yazılım'] },
        { name: 'budget', label: 'Bütçe', type: 'select', required: false, options: ['5.000₺ - 15.000₺', '15.000₺ - 50.000₺', '50.000₺+'] },
        { name: 'message', label: 'Proje Detayları', type: 'textarea', required: true },
      ],
    },
  });

  // ─── Home Page ───
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Ana Sayfa',
      isPublished: true,
      sections: {
        create: [
          { type: 'hero', title: 'Hero', data: {}, sortOrder: 0 },
          { type: 'about', title: 'Hakkımızda', data: { title: 'DNZMEDYA Hakkında', content: 'Dijital dünyada fark yaratan çözümler üretiyoruz.' }, sortOrder: 1 },
          { type: 'services', title: 'Servisler', data: { title: 'Hizmetlerimiz', subtitle: 'Size özel dijital çözümler' }, sortOrder: 2 },
          { type: 'references', title: 'Referanslar', data: { title: 'Referanslarımız' }, sortOrder: 3 },
          { type: 'blog', title: 'Blog', data: { title: 'Son Yazılar', limit: 3 }, sortOrder: 4 },
          { type: 'faq', title: 'SSS', data: { title: 'Sıkça Sorulan Sorular' }, sortOrder: 5 },
          { type: 'contact', title: 'İletişim', data: { title: 'Bizimle İletişime Geçin' }, sortOrder: 6 },
        ],
      },
    },
  });

  console.log('✅ Seed completed!');
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
