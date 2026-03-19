import {
  Controller,
  Post,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('webhook')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async handleClerkWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string>,
  ) {
    const payload = req.rawBody?.toString() ?? '';
    const event = await this.authService.verifyWebhook(payload, headers);
    await this.authService.handleWebhookEvent(event);
    return { received: true };
  }
}
