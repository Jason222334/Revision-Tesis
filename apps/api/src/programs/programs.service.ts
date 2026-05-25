import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.program.findMany();
  }

  async create(data: any) {
    return this.prisma.program.create({
      data: {
        name: data.name,
      },
    });
  }
}
