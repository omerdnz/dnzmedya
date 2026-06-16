import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PostsService } from './posts.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('published')
  findPublished(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') categorySlug?: string,
    @Query('tag') tagSlug?: string,
  ) {
    return this.postsService.findPublished({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      categorySlug,
      tagSlug,
    });
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get('categories')
  findAllCategories() {
    return this.postsService.findAllCategories();
  }

  @Get('tags')
  findAllTags() {
    return this.postsService.findAllTags();
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: PostStatus,
    @Query('category') categorySlug?: string,
    @Query('tag') tagSlug?: string,
    @Query('search') search?: string,
  ) {
    return this.postsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status,
      categorySlug,
      tagSlug,
      search,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.read')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.create')
  createCategory(@Body() data: Record<string, unknown>) {
    return this.postsService.createCategory(data);
  }

  @Post('tags')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.create')
  createTag(@Body() data: Record<string, unknown>) {
    return this.postsService.createTag(data);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.create')
  create(@Body() data: Record<string, unknown>) {
    return this.postsService.create(data);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.update')
  updateCategory(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.postsService.updateCategory(id, data);
  }

  @Put('tags/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.update')
  updateTag(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.postsService.updateTag(id, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.postsService.update(id, data);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.delete')
  deleteCategory(@Param('id') id: string) {
    return this.postsService.deleteCategory(id);
  }

  @Delete('tags/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.delete')
  deleteTag(@Param('id') id: string) {
    return this.postsService.deleteTag(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('blog.delete')
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
