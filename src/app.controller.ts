import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
