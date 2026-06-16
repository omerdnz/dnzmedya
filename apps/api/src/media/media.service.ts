import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

const UPLOADS_DIR = join(process.cwd(), 'uploads');
const THUMBNAIL_SIZE = 300;

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {
    if (!existsSync(UPLOADS_DIR)) {
      mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  async findAll(query: { page?: number; limit?: number; folder?: string; mimeType?: string }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};
    if (query.folder) where.folder = query.folder;
    if (query.mimeType) where.mimeType = { startsWith: query.mimeType };

    const [data, total] = await Promise.all([
      this.prisma.media.findMany({
        where: where as never,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.media.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findOne(id: string) {
    return this.prisma.media.findUnique({
      where: { id },
      include: { versions: true, parent: true },
    });
  }

  async upload(file: Express.Multer.File, meta: { folder?: string; alt?: string }) {
    if (!file) throw new BadRequestException('No file provided');

    const folder = meta.folder || 'general';
    const folderPath = join(UPLOADS_DIR, folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const ext = extname(file.originalname).toLowerCase() || extname(file.filename);
    const filename = `${uuidv4()}${ext}`;
    const storageKey = `${folder}/${filename}`;
    const filePath = join(UPLOADS_DIR, storageKey);
    const url = `/uploads/${storageKey}`;

    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;

    const isImage = file.mimetype.startsWith('image/');

    if (isImage) {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      await image.toFile(filePath);

      const thumbFilename = `${uuidv4()}_thumb${ext}`;
      const thumbStorageKey = `${folder}/${thumbFilename}`;
      const thumbPath = join(UPLOADS_DIR, thumbStorageKey);

      await sharp(file.buffer)
        .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'inside', withoutEnlargement: true })
        .toFile(thumbPath);

      thumbnailUrl = `/uploads/${thumbStorageKey}`;
    } else {
      const { writeFileSync } = await import('fs');
      writeFileSync(filePath, file.buffer);
    }

    return this.prisma.media.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        width,
        height,
        alt: meta.alt,
        url,
        thumbnailUrl,
        storageKey,
        folder,
      },
    });
  }

  async delete(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    this.removeFile(media.storageKey);
    if (media.thumbnailUrl) {
      const thumbKey = media.thumbnailUrl.replace('/uploads/', '');
      this.removeFile(thumbKey);
    }

    return this.prisma.media.delete({ where: { id } });
  }

  async crop(id: string, crop: { x: number; y: number; width: number; height: number; alt?: string }) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    if (!media.mimeType.startsWith('image/')) {
      throw new BadRequestException('Only images can be cropped');
    }

    const sourcePath = join(UPLOADS_DIR, media.storageKey);
    if (!existsSync(sourcePath)) {
      throw new NotFoundException('Source file not found on disk');
    }

    const ext = extname(media.filename);
    const filename = `${uuidv4()}_crop${ext}`;
    const storageKey = `${media.folder}/${filename}`;
    const filePath = join(UPLOADS_DIR, storageKey);

    const cropped = sharp(sourcePath).extract({
      left: Math.round(crop.x),
      top: Math.round(crop.y),
      width: Math.round(crop.width),
      height: Math.round(crop.height),
    });

    const metadata = await cropped.metadata();
    await cropped.toFile(filePath);

    const thumbFilename = `${uuidv4()}_thumb${ext}`;
    const thumbStorageKey = `${media.folder}/${thumbFilename}`;
    const thumbPath = join(UPLOADS_DIR, thumbStorageKey);

    await sharp(filePath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'inside', withoutEnlargement: true })
      .toFile(thumbPath);

    return this.prisma.media.create({
      data: {
        filename,
        originalName: `${media.originalName} (cropped)`,
        mimeType: media.mimeType,
        size: (await import('fs')).statSync(filePath).size,
        width: metadata.width,
        height: metadata.height,
        alt: crop.alt ?? media.alt,
        url: `/uploads/${storageKey}`,
        thumbnailUrl: `/uploads/${thumbStorageKey}`,
        storageKey,
        folder: media.folder,
        parentId: media.id,
        version: media.version + 1,
      },
    });
  }

  async updateMetadata(id: string, data: { alt?: string; folder?: string }) {
    return this.prisma.media.update({
      where: { id },
      data,
    });
  }

  private removeFile(storageKey: string) {
    const filePath = join(UPLOADS_DIR, storageKey);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
