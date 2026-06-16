import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizePrismaInput } from '../common/sanitize-prisma-input';

function paginate(page = 1, limit = 20) {
  const take = Math.min(limit, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  avatar: true,
  isActive: true,
  twoFactorEnabled: true,
  lastLoginAt: true,
  lastLoginIp: true,
  roleId: true,
  role: { select: { id: true, name: true, slug: true } },
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; search?: string; roleId?: string }) {
    const { take, skip } = paginate(query.page, query.limit);
    const where: Record<string, unknown> = {};
    if (query.roleId) where.roleId = query.roleId;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search } },
        { firstName: { contains: query.search } },
        { lastName: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: where as never,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.user.count({ where: where as never }),
    ]);

    return { data, meta: { total, page: query.page || 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async create(data: Record<string, unknown>) {
    const clean = sanitizePrismaInput(data);
    const { password, ...userData } = clean as { password?: string; [key: string]: unknown };

    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password is required');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: userData.email as string },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);

    return this.prisma.user.create({
      data: { ...userData, passwordHash } as never,
      select: userSelect,
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    const clean = sanitizePrismaInput(data);
    const { password, email, ...userData } = clean as {
      password?: string;
      email?: string;
      [key: string]: unknown;
    };

    if (email && email !== existing.email) {
      const emailTaken = await this.prisma.user.findUnique({ where: { email } });
      if (emailTaken) throw new ConflictException('Email already in use');
    }

    const updateData: Record<string, unknown> = { ...userData };
    if (email) updateData.email = email;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData as never,
      select: userSelect,
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: userSelect,
    });
  }

  findAllRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  findRole(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }
}
