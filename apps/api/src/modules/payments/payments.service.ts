import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getMyPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPayment(userId: string, plan: string, amount: number, currency: string) {
    return this.prisma.payment.create({
      data: { userId, plan, amount, currency, status: 'pending' },
    });
  }

  // FIX: Verify payment belongs to the requesting user before confirming
  async confirmPayment(id: string, requestingUserId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId !== requestingUserId) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.payment.update({
      where: { id },
      data: { status: 'completed' },
    });
  }
}
