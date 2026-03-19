import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';

export interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string; id: string }>;
    first_name?: string;
    last_name?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async verifyWebhook(
    payload: string,
    headers: Record<string, string>,
  ): Promise<ClerkWebhookEvent> {
    const webhookSecret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const wh = new Webhook(webhookSecret);
    try {
      const event = wh.verify(payload, headers) as ClerkWebhookEvent;
      return event;
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  async handleWebhookEvent(event: ClerkWebhookEvent): Promise<void> {
    switch (event.type) {
      case 'user.created': {
        const emailAddress = event.data.email_addresses?.[0]?.email_address ?? '';
        const name = [event.data.first_name, event.data.last_name]
          .filter(Boolean)
          .join(' ') || emailAddress;

        await this.prisma.user.upsert({
          where: { clerkId: event.data.id },
          update: { email: emailAddress, name },
          create: {
            clerkId: event.data.id,
            email: emailAddress,
            name,
          },
        });
        break;
      }
      case 'user.updated': {
        const emailAddress = event.data.email_addresses?.[0]?.email_address ?? '';
        const name = [event.data.first_name, event.data.last_name]
          .filter(Boolean)
          .join(' ') || emailAddress;

        await this.prisma.user.updateMany({
          where: { clerkId: event.data.id },
          data: { email: emailAddress, name },
        });
        break;
      }
      case 'user.deleted': {
        await this.prisma.user.deleteMany({
          where: { clerkId: event.data.id },
        });
        break;
      }
    }
  }
}
