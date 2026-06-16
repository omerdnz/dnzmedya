import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('faqs')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get('published')
  findPublished(@Query('category') category?: string) {
    return this.faqsService.findPublished(category);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('published') published?: string,
    @Query('category') category?: string,
  ) {
    return this.faqsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      category,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.read')
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.create')
  create(@Body() data: Record<string, unknown>) {
    return this.faqsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.faqsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.delete')
  delete(@Param('id') id: string) {
    return this.faqsService.delete(id);
  }
}
