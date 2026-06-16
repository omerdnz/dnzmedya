import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class ReferencesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; published?: boolean; category?: string }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};
    if (query.published !== undefined) where.isPublished = query.published;
    if (query.category) where.category = query.category;

    const [data, total] = await Promise.all([
      this.prisma.reference.findMany({
        where: where as never,
        include: { image: true },
        orderBy: { sortOrder: 'asc' },
        take,
        skip,
      }),
      this.prisma.reference.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findPublished(query: { page?: number; limit?: number; category?: string }) {
    return this.findAll({ ...query, published: true });
  }

  findOne(id: string) {
    return this.prisma.reference.findUnique({
      where: { id },
      include: { image: true },
    });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.reference.create({
      data: sanitizePrismaInput(data) as never,
      include: { image: true },
    });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.reference.update({
      where: { id },
      data: sanitizePrismaInput(data) as never,
      include: { image: true },
    });
  }

  delete(id: string) {
    return this.prisma.reference.delete({ where: { id } });
  }
}
