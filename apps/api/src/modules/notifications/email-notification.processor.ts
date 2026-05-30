import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

interface DeliverPayload {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Processor('notifications')
export class EmailNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailNotificationProcessor.name);
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  constructor(
    private notificationsService: NotificationsService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<DeliverPayload>) {
    const { userId, type, title, body, data } = job.data;

    const [user, prefs] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
      this.notificationsService.getPreferences(userId),
    ]);

    if (!user) throw new UnrecoverableError(`User ${userId} not found`);

    // ----- Email -----
    if (prefs.emailEnabled && this.shouldEmailForType(type)) {
      try {
        await this.transporter.sendMail({
          from: `"Cars Auto" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: title,
          html: `
            <div style="font-family: Arial; direction: rtl; padding: 24px;">
              <h2 style="color: #2563eb;">Cars Auto</h2>
              <p>مەرحەبا ${user.name}،</p>
              <h3>${title}</h3>
              <p>${body}</p>
            </div>
          `,
        });
        this.logger.log(`Email sent to ${user.email} for notification type=${type}`);
      } catch (err) {
        this.logger.error('Email delivery failed', err);
        throw err;
      }
    }

    // ----- Web Push -----
    if (prefs.pushEnabled) {
      await this.notificationsService.sendWebPush(userId, { title, body, data });
    }
  }

  private shouldEmailForType(type: string): boolean {
    const EMAIL_TYPES = new Set([
      'offer_received',
      'offer_accepted',
      'offer_declined',
      'saved_search_alert',
      'favorite_alert',
    ]);
    return EMAIL_TYPES.has(type);
  }
}
