import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('published') published?: string,
  ) {
    return this.pagesService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
    });
  }

  @Get(':id/sections')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.read')
  findSections(@Param('id') id: string) {
    return this.pagesService.findSections(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.read')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Post(':id/sections')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.update')
  createSection(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.pagesService.createSection(id, data);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.create')
  create(@Body() data: Record<string, unknown>) {
    return this.pagesService.create(data);
  }

  @Put(':id/sections/:sectionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.update')
  updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.pagesService.updateSection(id, sectionId, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.pagesService.update(id, data);
  }

  @Delete(':id/sections/:sectionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.update')
  deleteSection(@Param('id') id: string, @Param('sectionId') sectionId: string) {
    return this.pagesService.deleteSection(id, sectionId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.delete')
  delete(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }
}
