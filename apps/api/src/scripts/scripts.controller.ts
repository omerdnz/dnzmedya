import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('scripts')
export class ScriptsController {
  constructor(private scriptsService: ScriptsService) {}

  @Get('published')
  findPublished(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.scriptsService.findPublished({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.scriptsService.findBySlug(slug);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('published') published?: string,
  ) {
    return this.scriptsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('scripts.read')
  findOne(@Param('id') id: string) {
    return this.scriptsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('scripts.create')
  create(@Body() data: Record<string, unknown>) {
    return this.scriptsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('scripts.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.scriptsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('scripts.delete')
  delete(@Param('id') id: string) {
    return this.scriptsService.delete(id);
  }
}
