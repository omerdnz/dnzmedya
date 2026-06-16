'use client';

import { Card } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';

export default function BackupPage() {
  return (
    <div>
      <PageHeader
        title="Yedekleme"
        description="Sunucu yedekleme rehberi — otomatik yedekleme bir sonraki sürümde eklenecek"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10">
          <h2 className="font-heading text-lg font-semibold">Veritabanı</h2>
          <p className="mt-2 text-sm text-brand-gray-400">
            SQLite kullanıyorsanız aşağıdaki dosyayı düzenli olarak yedekleyin:
          </p>
          <code className="mt-4 block rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-xs text-brand-cyan">
            packages/database/prisma/dev.db
          </code>
          <p className="mt-4 text-sm text-brand-gray-500">
            Docker kullanıyorsanız <code className="text-brand-gray-300">db_data</code> volume&apos;ünü yedekleyin.
          </p>
        </Card>

        <Card className="border-white/10">
          <h2 className="font-heading text-lg font-semibold">Medya Dosyaları</h2>
          <p className="mt-2 text-sm text-brand-gray-400">
            Yüklenen görseller ve dosyalar:
          </p>
          <code className="mt-4 block rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-xs text-brand-cyan">
            apps/api/uploads/
          </code>
          <p className="mt-4 text-sm text-brand-gray-500">
            Docker&apos;da <code className="text-brand-gray-300">uploads_data</code> volume&apos;ünü kopyalayın.
          </p>
        </Card>
      </div>

      <Card className="mt-6 border-brand-gold/20 bg-brand-gold/5">
        <h2 className="font-heading text-lg font-semibold text-brand-gold">Önerilen yedekleme sıklığı</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-brand-gray-300">
          <li>Canlıya almadan önce tam yedek alın</li>
          <li>Haftalık otomatik sunucu yedeklemesi (hosting paneli veya cron)</li>
          <li>Büyük içerik güncellemelerinden önce manuel kopya</li>
        </ul>
      </Card>
    </div>
  );
}
