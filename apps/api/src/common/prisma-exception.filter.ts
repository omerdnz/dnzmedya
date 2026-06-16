import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Veritabanı hatası';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          message = 'Bu kayıt zaten mevcut (benzersiz alan çakışması)';
          break;
        case 'P2003':
          message = 'İlişkili kayıt bulunamadı';
          break;
        case 'P2025':
          message = 'Kayıt bulunamadı';
          status = HttpStatus.NOT_FOUND;
          break;
        default:
          message = exception.message;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      const lines = exception.message.split('\n');
      message = lines[lines.length - 1]?.trim() || exception.message;
    }

    response.status(status).json({ statusCode: status, message });
  }
}
