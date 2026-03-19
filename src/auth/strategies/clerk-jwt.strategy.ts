import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { createPublicKey } from 'crypto';

export interface ClerkJwtPayload {
  sub: string;
  email?: string;
  name?: string;
  azp?: string;
  iss?: string;
}

@Injectable()
export class ClerkJwtStrategy extends PassportStrategy(Strategy, 'clerk-jwt') {
  private jwksCache: Map<string, string> = new Map();
  private cacheExpiry = 0;

  private readonly JWKS_CACHE_TTL_MS = 60 * 60 * 1000;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request: unknown, rawJwtToken: unknown, done: (err: Error | null, key?: string | Buffer) => void) => {
        try {
          const jwksUri = configService.get<string>('CLERK_JWKS_URI', 'https://api.clerk.com/v1/jwks');
          const [headerB64] = (rawJwtToken as string).split('.');
          const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString()) as { kid: string };
          const kid = header.kid;

          const publicKey = await this.getPublicKey(jwksUri, kid);
          done(null, publicKey);
        } catch (err) {
          done(err as Error);
        }
      },
      ignoreExpiration: false,
    });
  }

  private async getPublicKey(jwksUri: string, kid: string): Promise<string> {
    const now = Date.now();
    if (this.cacheExpiry > now && this.jwksCache.has(kid)) {
      return this.jwksCache.get(kid)!;
    }

    const response = await fetch(jwksUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
    }

    const { keys } = (await response.json()) as {
      keys: Array<{ kid: string; n: string; e: string; kty: string }>;
    };
    this.jwksCache.clear();
    this.cacheExpiry = now + this.JWKS_CACHE_TTL_MS;

    for (const key of keys) {
      if (key.kty === 'RSA') {
        const publicKey = createPublicKey({
          key: { kty: key.kty, n: key.n, e: key.e },
          format: 'jwk',
        });
        const pem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
        this.jwksCache.set(key.kid, pem);
      }
    }

    const pem = this.jwksCache.get(kid);
    if (!pem) {
      throw new Error(`No key found for kid: ${kid}`);
    }
    return pem;
  }

  validate(payload: ClerkJwtPayload) {
    return payload;
  }
}
