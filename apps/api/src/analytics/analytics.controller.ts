import {
  Controller, Get, Post, Body, Query, Req, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('pageview')
  trackPageview(
    @Body() data: {
      path?: string;
      referrer?: string;
      source?: string;
      medium?: string;
      campaign?: string;
      country?: string;
      metadata?: Record<string, unknown>;
    },
    @Req() req: Request,
  ) {
    return this.analyticsService.trackPageview({
      ...data,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: data.referrer || req.headers.referer,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('reports.read')
  getDashboardStats(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getDashboardStats({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get('events')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('reports.read')
  findEvents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('path') path?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.findEvents({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      type,
      path,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }
}
