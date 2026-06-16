export interface FormFieldDef {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'email' | 'password';
}

const READONLY_KEYS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'viewCount',
  'publishedAt',
]);

export function rowToFormValues(
  row: Record<string, unknown>,
  fields: FormFieldDef[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    const value = row[field.name];
    if (field.type === 'checkbox') {
      result[field.name] = Boolean(value);
    } else if (field.type === 'number') {
      result[field.name] = value ?? '';
    } else {
      result[field.name] = value ?? '';
    }
  }
  return result;
}

export function formToPayload(
  values: Record<string, unknown>,
  fields: FormFieldDef[],
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const value = values[field.name];

    if (field.type === 'checkbox') {
      payload[field.name] = Boolean(value);
      continue;
    }

    if (value === '' || value === undefined || value === null) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      continue;
    }

    payload[field.name] = value;
  }

  return payload;
}

export function stripReadonlyFields(values: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(values)) {
    if (READONLY_KEYS.has(key)) continue;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
    if (value === '' || value === undefined) continue;
    payload[key] = value;
  }

  return payload;
}

export function parseApiErrorMessage(body: unknown, status: number): string {
  if (typeof body !== 'object' || body === null) {
    return `API hatası: ${status}`;
  }

  const message = (body as { message?: unknown }).message;

  if (Array.isArray(message)) {
    return message.map(String).join(', ');
  }

  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return `API hatası: ${status}`;
}
