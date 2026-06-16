import type { Metadata } from 'next';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Hazır Scriptler',
  description: 'DNZMEDYA hazır web scriptleri ve dijital çözümler.',
};

interface Script {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price?: number;
  demoUrl?: string;
}

async function getScripts(): Promise<Script[]> {
  try {
    const res = await apiFetch<{ data: Script[] }>('/scripts/published?limit=20');
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function ScriptlerPage() {
  const scripts = await getScripts();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-gold text-sm font-semibold tracking-wider uppercase">Hazır Scriptler</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mt-3">
            <span className="text-gradient-gold">Hazır Çözümler</span>
          </h1>
          <p className="text-brand-gray-400 max-w-xl mx-auto mt-4">
            Hızlı başlangıç için profesyonel hazır scriptler ve dijital ürünler.
          </p>
        </div>

        {scripts.length === 0 ? (
          <p className="text-center text-brand-gray-400">Henüz yayınlanmış script bulunmuyor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <div key={script.id} className="glass rounded-2xl p-6 hover-glow transition-all">
                <h2 className="font-heading text-xl font-bold mb-2">{script.title}</h2>
                {script.description && (
                  <p className="text-brand-gray-400 text-sm mb-4 line-clamp-3">{script.description}</p>
                )}
                {script.price != null && (
                  <p className="text-brand-gold font-semibold mb-4">{Number(script.price).toLocaleString('tr-TR')} ₺</p>
                )}
                {script.demoUrl && (
                  <a
                    href={script.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cyan text-sm hover:underline"
                  >
                    Demo Gör →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/teklif-al" className="text-brand-gold hover:underline">
            Özel proje mi istiyorsunuz? Teklif alın →
          </Link>
        </div>
      </div>
    </div>
  );
}
