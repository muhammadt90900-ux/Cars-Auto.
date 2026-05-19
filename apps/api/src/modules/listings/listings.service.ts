// apps/api/src/modules/listings/listings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    return this.prisma.listing.findMany({ where: { status: 'ACTIVE' }, take: 20 });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({ where: { id }, include: { images: true, location: true } });
  }

  async create(data: any) {
    return this.prisma.listing.create({ data });
  }
}
