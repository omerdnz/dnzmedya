import { Injectable } from '@nestjs/common';
import { QuoteStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { DashboardStats } from '@dnzmedya/types';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(): Promise<DashboardStats> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      visitors,
      forms,
      quotes,
      approvedQuotes,
      trafficSourcesRaw,
      formSubmissionsBySource,
    ] = await Promise.all([
      this.prisma.analyticsEvent.count({
        where: { type: 'pageview', createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.formSubmission.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.quote.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.quote.count({
        where: { status: QuoteStatus.APPROVED, createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['source'],
        where: { type: 'pageview', source: { not: null }, createdAt: { gte: thirtyDaysAgo } },
        _count: { source: true },
        orderBy: { _count: { source: 'desc' } },
        take: 10,
      }),
      this.prisma.formSubmission.groupBy({
        by: ['source'],
        where: { source: { not: null }, createdAt: { gte: thirtyDaysAgo } },
        _count: { source: true },
      }),
    ]);

    const conversionRate = quotes > 0 ? Math.round((approvedQuotes / quotes) * 10000) / 100 : 0;

    const trafficSources = trafficSourcesRaw.map((s) => ({
      source: s.source || 'direct',
      count: s._count.source,
    }));

    const serviceSales = formSubmissionsBySource.map((s) => ({
      service: s.source || 'unknown',
      count: s._count.source,
    }));

    return {
      visitors,
      forms,
      quotes,
      conversionRate,
      trafficSources,
      serviceSales,
    };
  }

  async getOverview() {
    const [stats, recentSubmissions, recentQuotes, recentCustomers] = await Promise.all([
      this.getStats(),
      this.prisma.formSubmission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { form: { select: { name: true, slug: true } } },
      }),
      this.prisma.quote.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
      }),
      this.prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { stats, recentSubmissions, recentQuotes, recentCustomers };
  }
}
