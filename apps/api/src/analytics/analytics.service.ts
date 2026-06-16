import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  trackPageview(data: {
    path?: string;
    referrer?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    ip?: string;
    userAgent?: string;
    country?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.analyticsEvent.create({
      data: {
        type: 'pageview',
        path: data.path,
        referrer: data.referrer,
        source: data.source,
        medium: data.medium,
        campaign: data.campaign,
        ip: data.ip,
        userAgent: data.userAgent,
        country: data.country,
        metadata: data.metadata as never,
      },
    });
  }

  async getDashboardStats(query: { from?: Date; to?: Date }) {
    const from = query.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ?? new Date();
    const dateFilter = { createdAt: { gte: from, lte: to } };

    const [
      totalPageviews,
      uniquePaths,
      topPages,
      trafficSources,
      dailyPageviews,
    ] = await Promise.all([
      this.prisma.analyticsEvent.count({
        where: { type: 'pageview', ...dateFilter },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['path'],
        where: { type: 'pageview', path: { not: null }, ...dateFilter },
        _count: { path: true },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['path'],
        where: { type: 'pageview', path: { not: null }, ...dateFilter },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['source'],
        where: { type: 'pageview', source: { not: null }, ...dateFilter },
        _count: { source: true },
        orderBy: { _count: { source: 'desc' } },
        take: 10,
      }),
      this.prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
        FROM analytics_events
        WHERE type = 'pageview'
          AND "createdAt" >= ${from}
          AND "createdAt" <= ${to}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ]);

    return {
      period: { from, to },
      totalPageviews,
      uniquePages: uniquePaths.length,
      topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
      trafficSources: trafficSources.map((s) => ({ source: s.source, count: s._count.source })),
      dailyPageviews: dailyPageviews.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
    };
  }

  async findEvents(query: {
    page?: number;
    limit?: number;
    type?: string;
    path?: string;
    from?: Date;
    to?: Date;
  }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};
    if (query.type) where.type = query.type;
    if (query.path) where.path = query.path;
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: query.from } : {}),
        ...(query.to ? { lte: query.to } : {}),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.analyticsEvent.findMany({
        where: where as never,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.analyticsEvent.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }
}
