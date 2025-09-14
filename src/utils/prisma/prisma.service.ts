/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        console.log('🔌 Connecting to PostgreSQL...');
        await this.$connect();
        console.log('✅ Connected to PostgreSQL');
        break;
      } catch (err) {
        console.error(`❌ Failed to connect. Retries left: ${retries - 1}`);
        retries--;
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
