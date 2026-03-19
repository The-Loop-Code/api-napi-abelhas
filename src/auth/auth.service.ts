import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {}

  verifyWebhook(
    payload: string,
    headers: Record<string, string>,
  ): ClerkWebhookEvent {
    const webhookSecret = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    );
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
    this.logger.log(`Received webhook event: ${event.type} for user ${event.data.id}`);
  }
}
