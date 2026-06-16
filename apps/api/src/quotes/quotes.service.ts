import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuoteStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

interface QuoteItemInput {
  description: string;
  quantity?: number;
  unitPrice: number | string;
  sortOrder?: number;
}

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  private calculateTotals(items: QuoteItemInput[], taxRate: number) {
    const processedItems = items.map((item, index) => {
      const quantity = item.quantity ?? 1;
      const unitPrice = new Prisma.Decimal(item.unitPrice);
      const total = unitPrice.mul(quantity);
      return {
        description: item.description,
        quantity,
        unitPrice,
        total,
        sortOrder: item.sortOrder ?? index,
      };
    });

    const subtotal = processedItems.reduce(
      (sum, item) => sum.add(item.total),
      new Prisma.Decimal(0),
    );
    const taxAmount = subtotal.mul(taxRate).div(100);
    const total = subtotal.add(taxAmount);

    return { processedItems, subtotal, taxAmount, total };
  }

  async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `QT-${year}-`;

    const lastQuote = await this.prisma.quote.findFirst({
      where: { number: { startsWith: prefix } },
      orderBy: { number: 'desc' },
    });

    let sequence = 1;
    if (lastQuote) {
      const lastSeq = parseInt(lastQuote.number.replace(prefix, ''), 10);
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  async findAll(query: { page?: number; limit?: number; status?: QuoteStatus; customerId?: string }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Prisma.QuoteWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;

    const [data, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        include: {
          customer: true,
          items: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.quote.count({ where }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findOne(id: string) {
    return this.prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async create(data: Record<string, unknown>) {
    const { items, taxRate = 20, ...quoteData } = data as {
      items?: QuoteItemInput[];
      taxRate?: number;
      [key: string]: unknown;
    };

    if (!items?.length) {
      throw new BadRequestException('Quote must have at least one item');
    }

    const number = await this.generateQuoteNumber();
    const { processedItems, subtotal, taxAmount, total } = this.calculateTotals(items, Number(taxRate));

    return this.prisma.quote.create({
      data: {
        ...quoteData,
        number,
        taxRate,
        subtotal,
        taxAmount,
        total,
        items: { create: processedItems },
      } as never,
      include: { customer: true, items: true },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.prisma.quote.findUnique({ where: { id }, include: { items: true } });
    if (!existing) throw new NotFoundException('Quote not found');

    const { items, taxRate, ...quoteData } = data as {
      items?: QuoteItemInput[];
      taxRate?: number;
      [key: string]: unknown;
    };

    if (items) {
      const rate = taxRate !== undefined ? Number(taxRate) : Number(existing.taxRate);
      const { processedItems, subtotal, taxAmount, total } = this.calculateTotals(items, rate);

      await this.prisma.quoteItem.deleteMany({ where: { quoteId: id } });

      return this.prisma.quote.update({
        where: { id },
        data: {
          ...quoteData,
          taxRate: rate,
          subtotal,
          taxAmount,
          total,
          items: { create: processedItems },
        } as never,
        include: { customer: true, items: true },
      });
    }

    return this.prisma.quote.update({
      where: { id },
      data: { ...quoteData, ...(taxRate !== undefined ? { taxRate } : {}) } as never,
      include: { customer: true, items: true },
    });
  }

  async updateStatus(id: string, status: QuoteStatus) {
    const existing = await this.prisma.quote.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quote not found');

    const timestamps: Record<string, Date> = {};
    if (status === QuoteStatus.SENT && !existing.sentAt) timestamps.sentAt = new Date();
    if (status === QuoteStatus.APPROVED && !existing.approvedAt) timestamps.approvedAt = new Date();

    return this.prisma.quote.update({
      where: { id },
      data: { status, ...timestamps },
      include: { customer: true, items: true },
    });
  }

  delete(id: string) {
    return this.prisma.quote.delete({ where: { id } });
  }
}
