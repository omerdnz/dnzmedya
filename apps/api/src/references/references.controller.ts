import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('references')
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  @Get('published')
  findPublished(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
  ) {
    return this.referencesService.findPublished({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      category,
    });
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('published') published?: string,
    @Query('category') category?: string,
  ) {
    return this.referencesService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      category,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('references.read')
  findOne(@Param('id') id: string) {
    return this.referencesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('references.create')
  create(@Body() data: Record<string, unknown>) {
    return this.referencesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('references.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.referencesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('references.delete')
  delete(@Param('id') id: string) {
    return this.referencesService.delete(id);
  }
}
