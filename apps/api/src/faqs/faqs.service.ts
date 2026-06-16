import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; published?: boolean; category?: string }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};
    if (query.published !== undefined) where.isPublished = query.published;
    if (query.category) where.category = query.category;

    const [data, total] = await Promise.all([
      this.prisma.faq.findMany({
        where: where as never,
        orderBy: { sortOrder: 'asc' },
        take,
        skip,
      }),
      this.prisma.faq.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findPublished(category?: string) {
    return this.findAll({ published: true, category, limit: 100 });
  }

  findOne(id: string) {
    return this.prisma.faq.findUnique({ where: { id } });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.faq.create({ data: sanitizePrismaInput(data) as never });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.faq.update({ where: { id }, data: sanitizePrismaInput(data) as never });
  }

  delete(id: string) {
    return this.prisma.faq.delete({ where: { id } });
  }
}
