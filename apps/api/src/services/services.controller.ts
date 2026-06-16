import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('published') published?: string) {
    return this.servicesService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
    });
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services.read')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services.create')
  create(@Body() data: Record<string, unknown>) {
    return this.servicesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.servicesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services.delete')
  delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
