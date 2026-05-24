// apps/api/src/modules/listings/listings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    locationId?: string;
    // Vehicle filters — all optional, compose dynamically
    brandId?: string;
    modelId?: string;
    trimId?: string;
    year?: string;
    minYear?: string;
    maxYear?: string;
    condition?: string;
    maxMileage?: string;
    page?: string;
    limit?: string;
  }) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: any = { status: 'ACTIVE' };

    // ── Basic filters ───────────────────────────────────────────────────────
    if (query.type)       where.type       = query.type;
    if (query.locationId) where.locationId = query.locationId;
    if (query.condition)  where.condition  = query.condition;

    // ── Price range ─────────────────────────────────────────────────────────
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }

    // ── Vehicle hierarchy filters ───────────────────────────────────────────
    // Each level is independent so the frontend can filter at any granularity.
    if (query.brandId) where.makeId  = query.brandId;
    if (query.modelId) where.modelId = query.modelId;
    if (query.trimId)  where.trimId  = query.trimId;

    // ── Year range ──────────────────────────────────────────────────────────
    if (query.year) {
      where.year = Number(query.year);
    } else if (query.minYear || query.maxYear) {
      where.year = {};
      if (query.minYear) where.year.gte = Number(query.minYear);
      if (query.maxYear) where.year.lte = Number(query.maxYear);
    }

    // ── Mileage cap ─────────────────────────────────────────────────────────
    if (query.maxMileage) {
      where.mileage = { lte: Number(query.maxMileage) };
    }

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: {
          images:    { where: { isCover: true }, take: 1 },
          location:  true,
          user:      { select: { id: true, name: true, avatar: true, verified: true } },
          // Vehicle relations — lean selects to keep payload small
          make:  { select: { id: true, nameEn: true, nameAr: true, nameKu: true, logo: true } },
          model: { select: { id: true, nameEn: true, nameAr: true, nameKu: true } },
          trim:  { select: { id: true, nameEn: true, nameAr: true, nameKu: true } },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images:   true,
        location: true,
        user: {
          select: { id: true, name: true, avatar: true, verified: true, phone: true },
        },
        make:  { select: { id: true, nameEn: true, nameAr: true, nameKu: true, logo: true } },
        model: { select: { id: true, nameEn: true, nameAr: true, nameKu: true } },
        trim:  { select: { id: true, nameEn: true, nameAr: true, nameKu: true, engine: true, transmission: true, fuelType: true } },
      },
    });
    if (!listing) throw new NotFoundException('Listing not found');

    await this.prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return listing;
  }

  async create(data: CreateListingDto & { userId: string }) {
    const { images, userId, ...rest } = data as any;
    return this.prisma.listing.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
        ...(images?.length
          ? {
              images: {
                create: images.map((url: string, i: number) => ({
                  url,
                  isCover: i === 0,
                })),
              },
            }
          : {}),
      },
    });
  }

  async myListings(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isCover: true }, take: 1 },
        make:   { select: { id: true, nameEn: true, logo: true } },
        model:  { select: { id: true, nameEn: true } },
      },
    });
  }

  async delete(id: string, userId: string) {
    const listing = await this.prisma.listing.findFirst({ where: { id, userId } });
    if (!listing) throw new NotFoundException('Listing not found');
    return this.prisma.listing.delete({ where: { id } });
  }
}
