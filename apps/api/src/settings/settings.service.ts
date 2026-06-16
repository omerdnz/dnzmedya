import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAllGrouped() {
    const settings = await this.prisma.setting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    return settings.reduce<Record<string, Record<string, unknown>>>((acc, setting) => {
      if (!acc[setting.group]) acc[setting.group] = {};
      acc[setting.group][setting.key] = setting.value;
      return acc;
    }, {});
  }

  async findByGroup(group: string) {
    const settings = await this.prisma.setting.findMany({
      where: { group },
      orderBy: { key: 'asc' },
    });
    if (!settings.length) {
      throw new NotFoundException(`Settings group "${group}" not found`);
    }
    return settings.reduce<Record<string, unknown>>((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

  async getPublicSiteSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { group: { in: ['site', 'social', 'theme'] } },
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    const result: Record<string, Record<string, unknown>> = {};
    for (const setting of settings) {
      if (!result[setting.group]) result[setting.group] = {};
      result[setting.group][setting.key] = setting.value;
    }
    return result;
  }

  async updateByGroupKey(group: string, key: string, value: unknown) {
    return this.prisma.setting.upsert({
      where: { group_key: { group, key } },
      update: { value: value as never },
      create: { group, key, value: value as never },
    });
  }

  async updateGroup(group: string, data: Record<string, unknown>) {
    const updates = Object.entries(data).map(([key, value]) =>
      this.updateByGroupKey(group, key, value),
    );
    await Promise.all(updates);
    return this.findByGroup(group);
  }
}
