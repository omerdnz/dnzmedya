import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: CustomerStatus;
    search?: string;
  }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
        { company: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: where as never,
        include: {
          _count: { select: { activities: true, quotes: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.customer.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findOne(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        quotes: { orderBy: { createdAt: 'desc' }, include: { items: true } },
      },
    });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.customer.create({ data: sanitizePrismaInput(data) as never });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.customer.update({ where: { id }, data: sanitizePrismaInput(data) as never });
  }

  delete(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }

  findActivities(customerId: string) {
    return this.prisma.customerActivity.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createActivity(customerId: string, data: Record<string, unknown>) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.customerActivity.create({
      data: { ...data, customerId } as never,
    });
  }

  async updateActivity(customerId: string, activityId: string, data: Record<string, unknown>) {
    const activity = await this.prisma.customerActivity.findFirst({
      where: { id: activityId, customerId },
    });
    if (!activity) throw new NotFoundException('Activity not found');

    return this.prisma.customerActivity.update({
      where: { id: activityId },
      data: data as never,
    });
  }

  async deleteActivity(customerId: string, activityId: string) {
    const activity = await this.prisma.customerActivity.findFirst({
      where: { id: activityId, customerId },
    });
    if (!activity) throw new NotFoundException('Activity not found');

    return this.prisma.customerActivity.delete({ where: { id: activityId } });
  }
}
