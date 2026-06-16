const READONLY_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'viewCount',
  'number',
  'entityType',
  'entityId',
]);

const RELATION_FIELDS = new Set([
  'icon',
  'image',
  'images',
  'seo',
  'author',
  'customer',
  'role',
  'user',
  'sections',
  'thumbnail',
  'coverImage',
  'cover',
  'ogImage',
  'categories',
  'tags',
  'items',
  'activities',
  'submissions',
  'form',
  'refreshTokens',
  'permissions',
  'posts',
  'auditLogs',
  'users',
  'quotes',
]);

const JSON_FIELDS = new Set([
  'content',
  'features',
  'data',
  'fields',
  'techStack',
  'results',
  'metadata',
  'lineItems',
]);

function isRelationObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if ('type' in record && record.type === 'doc') {
    return false;
  }

  return (
    'id' in record &&
    ('createdAt' in record ||
      'updatedAt' in record ||
      'email' in record ||
      'filename' in record ||
      ('name' in record && 'slug' in record))
  );
}

export function sanitizePrismaInput(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (READONLY_FIELDS.has(key) || RELATION_FIELDS.has(key)) {
      continue;
    }

    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (typeof value === 'number' && Number.isNaN(value)) {
      continue;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        result[key] = value;
        continue;
      }

      if (JSON_FIELDS.has(key) || !isRelationObject(value)) {
        result[key] = value;
      }

      continue;
    }

    result[key] = value;
  }

  return result;
}
