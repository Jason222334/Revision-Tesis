import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GeneratedThesisService {
  constructor(private prisma: PrismaService) {}

  async create(title: string, userId: string) {
    return this.prisma.generatedThesis.create({
      data: {
        title,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.generatedThesis.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
