import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('media.read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('folder') folder?: string,
    @Query('mimeType') mimeType?: string,
  ) {
    return this.mediaService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      folder,
      mimeType,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('media.read')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('media.create')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
    @Body('alt') alt?: string,
  ) {
    return this.mediaService.upload(file, { folder, alt });
  }

  @Post(':id/crop')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('media.update')
  crop(
    @Param('id') id: string,
    @Body() crop: { x: number; y: number; width: number; height: number; alt?: string },
  ) {
    return this.mediaService.crop(id, crop);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('media.update')
  updateMetadata(@Param('id') id: string, @Body() data: { alt?: string; folder?: string }) {
    return this.mediaService.updateMetadata(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('media.delete')
  delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
