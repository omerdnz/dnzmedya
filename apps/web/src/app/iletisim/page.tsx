import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections/contact';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'DNZMEDYA ile iletişime geçin — web tasarım, SEO, dijital reklam ve yazılım projeleriniz için.',
};

export default function IletisimPage() {
  return (
    <div className="pt-20">
      <ContactSection />
    </div>
  );
}
