import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class ScriptsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; published?: boolean }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where = query.published !== undefined ? { isPublished: query.published } : {};

    const [data, total] = await Promise.all([
      this.prisma.script.findMany({
        where,
        include: { thumbnail: true, seo: true },
        orderBy: { sortOrder: 'asc' },
        take,
        skip,
      }),
      this.prisma.script.count({ where }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findPublished(query: { page?: number; limit?: number }) {
    return this.findAll({ ...query, published: true });
  }

  findBySlug(slug: string) {
    return this.prisma.script.findFirst({
      where: { slug, isPublished: true },
      include: { thumbnail: true, seo: { include: { ogImage: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.script.findUnique({
      where: { id },
      include: { thumbnail: true, seo: true },
    });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.script.create({
      data: sanitizePrismaInput(data) as never,
      include: { thumbnail: true },
    });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.script.update({
      where: { id },
      data: sanitizePrismaInput(data) as never,
      include: { thumbnail: true },
    });
  }

  delete(id: string) {
    return this.prisma.script.delete({ where: { id } });
  }
}
