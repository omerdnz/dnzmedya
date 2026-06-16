import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { FormsService } from './forms.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('forms')
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.formsService.findBySlug(slug);
  }

  @Post('slug/:slug/submit')
  submit(
    @Param('slug') slug: string,
    @Body() data: Record<string, unknown>,
    @Req() req: Request,
  ) {
    return this.formsService.submit(slug, data, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      source: (data.source as string) || req.headers.referer,
    });
  }

  @Get('submissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.read')
  findAllSubmissions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: string,
  ) {
    return this.formsService.findAllSubmissions({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.read')
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.read')
  findSubmissions(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: string,
  ) {
    return this.formsService.findSubmissions(id, {
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.read')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.create')
  create(@Body() data: Record<string, unknown>) {
    return this.formsService.create(data);
  }

  @Put('submissions/:submissionId/read')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.update')
  markSubmissionRead(@Param('submissionId') submissionId: string) {
    return this.formsService.markSubmissionRead(submissionId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.formsService.update(id, data);
  }

  @Delete('submissions/:submissionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.delete')
  deleteSubmission(@Param('submissionId') submissionId: string) {
    return this.formsService.deleteSubmission(submissionId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('forms.delete')
  delete(@Param('id') id: string) {
    return this.formsService.delete(id);
  }
}
