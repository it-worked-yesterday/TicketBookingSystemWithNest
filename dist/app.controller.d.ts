import { AppService } from './app.service';
import { User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getUsers(): Promise<User[]>;
    getHello(): string;
}
