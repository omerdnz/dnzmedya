import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

export interface AuditLogInput {
  userId?: string;
  action: string;
  module: string;
  entityId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        module: input.module,
        entityId: input.entityId,
        oldData: input.oldData as never,
        newData: input.newData as never,
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    module?: string;
    action?: string;
    userId?: string;
    entityId?: string;
    from?: Date;
    to?: Date;
  }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};

    if (query.module) where.module = query.module;
    if (query.action) where.action = query.action;
    if (query.userId) where.userId = query.userId;
    if (query.entityId) where.entityId = query.entityId;
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: query.from } : {}),
        ...(query.to ? { lte: query.to } : {}),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: where as never,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.auditLog.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findOne(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
  }
}
