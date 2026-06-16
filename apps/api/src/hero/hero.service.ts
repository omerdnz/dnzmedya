import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  findActive() {
    return this.prisma.hero.findFirst({
      where: { isActive: true },
      include: { image: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.hero.findMany({ include: { image: true }, orderBy: { updatedAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.hero.findUnique({ where: { id }, include: { image: true } });
  }

  create(data: Record<string, unknown>) {
    return this.prisma.hero.create({ data: sanitizePrismaInput(data) as never, include: { image: true } });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.hero.update({ where: { id }, data: sanitizePrismaInput(data) as never, include: { image: true } });
  }

  delete(id: string) {
    return this.prisma.hero.delete({ where: { id } });
  }
}
