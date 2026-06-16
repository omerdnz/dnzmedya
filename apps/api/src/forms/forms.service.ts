import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.form.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { submissions: true } } },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.form.findFirst({
      where: { slug, isActive: true },
    });
  }

  findOne(id: string) {
    return this.prisma.form.findUnique({
      where: { id },
      include: { _count: { select: { submissions: true } } },
    });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.form.create({ data: sanitizePrismaInput(data) as never });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.form.update({ where: { id }, data: sanitizePrismaInput(data) as never });
  }

  delete(id: string) {
    return this.prisma.form.delete({ where: { id } });
  }

  async submit(
    slug: string,
    data: Record<string, unknown>,
    meta: { ip?: string; userAgent?: string; source?: string },
  ) {
    const form = await this.prisma.form.findFirst({ where: { slug, isActive: true } });
    if (!form) throw new NotFoundException('Form not found or inactive');

    const fields = form.fields as { name: string; required?: boolean }[];
    if (Array.isArray(fields)) {
      for (const field of fields) {
        if (field.required && (data[field.name] === undefined || data[field.name] === '')) {
          throw new BadRequestException(`Field "${field.name}" is required`);
        }
      }
    }

    return this.prisma.formSubmission.create({
      data: {
        formId: form.id,
        data: data as never,
        ip: meta.ip,
        userAgent: meta.userAgent,
        source: meta.source,
      },
    });
  }

  async findSubmissions(formId: string, query: { page?: number; limit?: number; isRead?: boolean }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = { formId };
    if (query.isRead !== undefined) where.isRead = query.isRead;

    const [data, total] = await Promise.all([
      this.prisma.formSubmission.findMany({
        where: where as never,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.formSubmission.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  async findAllSubmissions(query: { page?: number; limit?: number; isRead?: boolean }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where = query.isRead !== undefined ? { isRead: query.isRead } : {};

    const [data, total] = await Promise.all([
      this.prisma.formSubmission.findMany({
        where,
        include: { form: { select: { id: true, slug: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.formSubmission.count({ where }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  markSubmissionRead(id: string, isRead = true) {
    return this.prisma.formSubmission.update({
      where: { id },
      data: { isRead },
    });
  }

  deleteSubmission(id: string) {
    return this.prisma.formSubmission.delete({ where: { id } });
  }
}
