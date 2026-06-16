import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; published?: boolean }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where = query.published !== undefined ? { isPublished: query.published } : {};
    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: { icon: true, image: true, seo: true },
        orderBy: { sortOrder: 'asc' },
        take,
        skip,
      }),
      this.prisma.service.count({ where }),
    ]);
    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findBySlug(slug: string) {
    return this.prisma.service.findUnique({
      where: { slug },
      include: { icon: true, image: true, seo: { include: { ogImage: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: { icon: true, image: true, seo: true },
    });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.service.create({ data: sanitizePrismaInput(data) as never, include: { icon: true, image: true } });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.service.update({ where: { id }, data: sanitizePrismaInput(data) as never, include: { icon: true, image: true } });
  }

  delete(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
