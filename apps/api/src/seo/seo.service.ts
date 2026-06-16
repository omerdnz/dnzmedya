import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

type EntityType = 'page' | 'post' | 'service' | 'script' | 'caseStudy';

const ENTITY_FIELD: Record<EntityType, string> = {
  page: 'pageId',
  post: 'postId',
  service: 'serviceId',
  script: 'scriptId',
  caseStudy: 'caseStudyId',
};

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  private validateEntityType(entityType: string): EntityType {
    if (!ENTITY_FIELD[entityType as EntityType]) {
      throw new BadRequestException(`Invalid entity type: ${entityType}`);
    }
    return entityType as EntityType;
  }

  async findByEntity(entityType: string, entityId: string) {
    const type = this.validateEntityType(entityType);
    const field = ENTITY_FIELD[type];

    const seo = await this.prisma.seoMeta.findFirst({
      where: { [field]: entityId },
      include: { ogImage: true },
    });

    if (!seo) {
      throw new NotFoundException(`SEO meta not found for ${entityType}:${entityId}`);
    }
    return seo;
  }

  async upsertByEntity(entityType: string, entityId: string, data: Record<string, unknown>) {
    const type = this.validateEntityType(entityType);
    const field = ENTITY_FIELD[type];

    const existing = await this.prisma.seoMeta.findFirst({
      where: { [field]: entityId },
    });

    const clean = sanitizePrismaInput(data);

    if (existing) {
      return this.prisma.seoMeta.update({
        where: { id: existing.id },
        data: clean as never,
        include: { ogImage: true },
      });
    }

    return this.prisma.seoMeta.create({
      data: { ...clean, [field]: entityId } as never,
      include: { ogImage: true },
    });
  }

  deleteByEntity(entityType: string, entityId: string) {
    const type = this.validateEntityType(entityType);
    const field = ENTITY_FIELD[type];

    return this.prisma.seoMeta.deleteMany({
      where: { [field]: entityId },
    });
  }
}
