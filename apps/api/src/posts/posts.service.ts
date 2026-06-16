import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private postInclude = {
    coverImage: true,
    author: { select: { id: true, firstName: true, lastName: true, email: true } },
    categories: true,
    tags: true,
    seo: true,
  };

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: PostStatus;
    categorySlug?: string;
    tagSlug?: string;
    search?: string;
  }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Prisma.PostWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.categorySlug) {
      where.categories = { some: { slug: query.categorySlug } };
    }
    if (query.tagSlug) {
      where.tags = { some: { slug: query.tagSlug } };
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { excerpt: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: this.postInclude,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take,
        skip,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findPublished(query: { page?: number; limit?: number; categorySlug?: string; tagSlug?: string }) {
    return this.findAll({ ...query, status: PostStatus.PUBLISHED });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      include: {
        ...this.postInclude,
        seo: { include: { ogImage: true } },
      },
    });
    if (post) {
      await this.prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });
    }
    return post;
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: this.postInclude,
    });
  }

  create(data: Record<string, unknown>) {
    const clean = sanitizePrismaInput(data);
    const { categoryIds, tagIds, ...postData } = clean as {
      categoryIds?: string[];
      tagIds?: string[];
      [key: string]: unknown;
    };

    return this.prisma.post.create({
      data: {
        ...postData,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
        tags: tagIds?.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      } as never,
      include: this.postInclude,
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Post not found');

    const clean = sanitizePrismaInput(data);
    const { categoryIds, tagIds, ...postData } = clean as {
      categoryIds?: string[];
      tagIds?: string[];
      [key: string]: unknown;
    };

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        categories: categoryIds !== undefined
          ? { set: categoryIds.map((cid) => ({ id: cid })) }
          : undefined,
        tags: tagIds !== undefined ? { set: tagIds.map((tid) => ({ id: tid })) } : undefined,
      } as never,
      include: this.postInclude,
    });
  }

  delete(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }

  findAllCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  createCategory(data: Record<string, unknown>) {
    return this.prisma.category.create({ data: data as never });
  }

  updateCategory(id: string, data: Record<string, unknown>) {
    return this.prisma.category.update({ where: { id }, data: data as never });
  }

  deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  findAllTags() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  createTag(data: Record<string, unknown>) {
    return this.prisma.tag.create({ data: data as never });
  }

  updateTag(id: string, data: Record<string, unknown>) {
    return this.prisma.tag.update({ where: { id }, data: data as never });
  }

  deleteTag(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
