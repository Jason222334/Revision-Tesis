import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GeneratedThesisService } from './generated-thesis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('generated-thesis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GeneratedThesisController {
  constructor(private readonly generatedThesisService: GeneratedThesisService) {}

  @Post()
  create(@Body() body: { title: string }, @Request() req) {
    return this.generatedThesisService.create(body.title, req.user.userId);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.generatedThesisService.findAll();
  }
}
