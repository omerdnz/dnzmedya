import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; published?: boolean }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where = query.published !== undefined ? { isPublished: query.published } : {};
    const [data, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        include: { sections: { orderBy: { sortOrder: 'asc' } }, seo: true },
        orderBy: { sortOrder: 'asc' },
        take,
        skip,
      }),
      this.prisma.page.count({ where }),
    ]);
    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findBySlug(slug: string) {
    return this.prisma.page.findFirst({
      where: { slug, isPublished: true },
      include: {
        sections: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        seo: { include: { ogImage: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.page.findUnique({
      where: { id },
      include: { sections: { orderBy: { sortOrder: 'asc' } }, seo: true },
    });
  }

  create(data: Record<string, unknown>) {
    const clean = sanitizePrismaInput(data);
    const { sections, seo, ...pageData } = clean as {
      sections?: Record<string, unknown>[];
      seo?: Record<string, unknown>;
      [key: string]: unknown;
    };
    return this.prisma.page.create({
      data: {
        ...pageData,
        sections: sections?.length
          ? { create: sections as never[] }
          : undefined,
        seo: seo ? { create: seo as never } : undefined,
      } as never,
      include: { sections: true, seo: true },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.prisma.page.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Page not found');

    const clean = sanitizePrismaInput(data);
    const { sections, seo, ...pageData } = clean as {
      sections?: Record<string, unknown>[];
      seo?: Record<string, unknown>;
      [key: string]: unknown;
    };

    return this.prisma.page.update({
      where: { id },
      data: pageData as never,
      include: { sections: { orderBy: { sortOrder: 'asc' } }, seo: true },
    });
  }

  delete(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }

  findSections(pageId: string) {
    return this.prisma.pageSection.findMany({
      where: { pageId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  createSection(pageId: string, data: Record<string, unknown>) {
    return this.prisma.pageSection.create({
      data: { ...data, pageId } as never,
    });
  }

  async updateSection(pageId: string, sectionId: string, data: Record<string, unknown>) {
    const section = await this.prisma.pageSection.findFirst({
      where: { id: sectionId, pageId },
    });
    if (!section) throw new NotFoundException('Section not found');

    return this.prisma.pageSection.update({
      where: { id: sectionId },
      data: data as never,
    });
  }

  async deleteSection(pageId: string, sectionId: string) {
    const section = await this.prisma.pageSection.findFirst({
      where: { id: sectionId, pageId },
    });
    if (!section) throw new NotFoundException('Section not found');

    return this.prisma.pageSection.delete({ where: { id: sectionId } });
  }
}
