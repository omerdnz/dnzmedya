import { Controller, Get, Put, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { SeoService } from './seo.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('seo')
export class SeoController {
  constructor(private seoService: SeoService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('seo.read')
  findByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.seoService.findByEntity(entityType, entityId);
  }

  @Put()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('seo.update')
  upsertByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.seoService.upsertByEntity(entityType, entityId, data);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('seo.delete')
  deleteByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.seoService.deleteByEntity(entityType, entityId);
  }
}
