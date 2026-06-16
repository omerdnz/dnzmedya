import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('hero')
export class HeroController {
  constructor(private heroService: HeroService) {}

  @Get('active')
  findActive() {
    return this.heroService.findActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.read')
  findAll() {
    return this.heroService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.read')
  findOne(@Param('id') id: string) {
    return this.heroService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.create')
  create(@Body() data: Record<string, unknown>) {
    return this.heroService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.heroService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('pages.delete')
  delete(@Param('id') id: string) {
    return this.heroService.delete(id);
  }
}
