import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.template.create({
      data: {
        name: data.name,
        programId: data.programId,
        fileUrl: data.fileUrl,
        structureJson: data.structureJson || {},
        isActive: true,
      },
    });
  }

  async findAll(programId?: string) {
    return this.prisma.template.findMany({
      where: programId ? { programId } : {},
      include: {
        program: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async remove(id: string) {
    return this.prisma.template.delete({
      where: { id },
    });
  }
}
