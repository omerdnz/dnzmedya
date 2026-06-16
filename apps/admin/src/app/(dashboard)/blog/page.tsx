'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';
import { useAuthStore } from '@/stores/auth';
import { apiFetch } from '@/lib/api';
import { blocksToEditorText, editorTextToBlocks } from '@/lib/blog-content';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown;
  status: string;
  viewCount: number;
  publishedAt?: string;
  categories?: Category[];
}

const statusOptions = [
  { value: 'DRAFT', label: 'Taslak' },
  { value: 'PUBLISHED', label: 'Yayında' },
  { value: 'ARCHIVED', label: 'Arşiv' },
];

export default function BlogPage() {
  const userId = useAuthStore((s) => s.user?.id);

  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => apiFetch<Category[]>('/posts/categories', { auth: true }),
  });

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <CrudResourcePage<PostRow>
      title="Blog"
      description="Blog yazılarını oluşturun, düzenleyin ve yayınlayın"
      endpoint="/posts"
      queryKey="posts"
      createLabel="Yeni Yazı"
      getDefaultValues={() => ({
        title: '',
        slug: '',
        excerpt: '',
        body: '',
        categoryId: '',
        status: 'DRAFT',
      })}
      mapRowToForm={(row) => ({
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt ?? '',
        body: blocksToEditorText(row.content),
        categoryId: row.categories?.[0]?.id ?? '',
        status: row.status,
      })}
      mapFormToPayload={(values, isEdit) => {
        const payload: Record<string, unknown> = {
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          content: editorTextToBlocks(String(values.body ?? '')),
          status: values.status,
        };

        if (values.categoryId) {
          payload.categoryIds = [values.categoryId];
        } else if (isEdit) {
          payload.categoryIds = [];
        }

        if (!isEdit) {
          if (!userId) {
            throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
          }
          payload.authorId = userId;
        }

        if (values.status === 'PUBLISHED') {
          payload.publishedAt = new Date().toISOString();
        }

        return payload;
      }}
      columns={[
        { key: 'title', header: 'Başlık' },
        { key: 'slug', header: 'Slug' },
        {
          key: 'categories',
          header: 'Kategori',
          render: (r) => r.categories?.[0]?.name ?? '—',
        },
        {
          key: 'status',
          header: 'Durum',
          render: (r) => (
            <Badge variant={r.status === 'PUBLISHED' ? 'gold' : r.status === 'DRAFT' ? 'default' : 'warning'}>
              {r.status}
            </Badge>
          ),
        },
        { key: 'viewCount', header: 'Görüntülenme' },
      ]}
      fields={[
        { name: 'title', label: 'Başlık', type: 'text', required: true, colSpan: 2 },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'status', label: 'Durum', type: 'select', options: statusOptions },
        {
          name: 'categoryId',
          label: 'Kategori',
          type: 'select',
          options: categoryOptions,
        },
        { name: 'excerpt', label: 'Özet', type: 'textarea', colSpan: 2 },
        {
          name: 'body',
          label: 'İçerik',
          type: 'textarea',
          colSpan: 2,
          placeholder: 'Paragraflar arasında boş satır bırakın. Başlık: ## Başlık, liste: - madde',
        },
      ]}
    />
  );
}
