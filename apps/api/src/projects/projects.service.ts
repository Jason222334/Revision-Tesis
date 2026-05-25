import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.thesisProject.create({
      data: {
        title: data.title,
        programId: data.programId,
        studentId: '2e95da01-5862-40e4-8057-01ea2ced64a6',
      },
    });
  }

  async findAll() {
    return this.prisma.thesisProject.findMany({
      include: {
        program: true,
        submissions: {
          orderBy: { version: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.thesisProject.findUnique({
      where: { id },
      include: {
        program: { include: { templates: { where: { isActive: true } } } },
        submissions: { include: { evaluation: true } },
      },
    });
  }
}
