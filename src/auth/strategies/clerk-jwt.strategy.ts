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

const jwksCache = new Map<string, string>();
let jwksCacheExpiry = 0;
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000;

async function getPublicKeyFromJwks(
  jwksUri: string,
  kid: string,
): Promise<string> {
  const now = Date.now();
  if (jwksCacheExpiry > now && jwksCache.has(kid)) {
    return jwksCache.get(kid)!;
  }

  const response = await fetch(jwksUri);
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
  }

  const { keys } = (await response.json()) as {
    keys: Array<{ kid: string; n: string; e: string; kty: string }>;
  };
  jwksCache.clear();
  jwksCacheExpiry = now + JWKS_CACHE_TTL_MS;

  for (const key of keys) {
    if (key.kty === 'RSA') {
      const publicKey = createPublicKey({
        key: { kty: key.kty, n: key.n, e: key.e },
        format: 'jwk',
      });
      const pem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
      jwksCache.set(key.kid, pem);
    }
  }

  const pem = jwksCache.get(kid);
  if (!pem) {
    throw new Error(`No key found for kid: ${kid}`);
  }
  return pem;
}

@Injectable()
export class ClerkJwtStrategy extends PassportStrategy(Strategy, 'clerk-jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (
        _request: unknown,
        rawJwtToken: unknown,
        done: (err: Error | null, key?: string | Buffer) => void,
      ): void => {
        const jwksUri =
          configService.get<string>('CLERK_JWKS_URI') ??
          'https://api.clerk.com/v1/jwks';
        const [headerB64] = (rawJwtToken as string).split('.');
        const header = JSON.parse(
          Buffer.from(headerB64, 'base64url').toString(),
        ) as { kid: string };

        getPublicKeyFromJwks(jwksUri, header.kid)
          .then((key) => done(null, key))
          .catch((err: Error) => done(err));
      },
      ignoreExpiration: false,
    });
  }

  validate(payload: ClerkJwtPayload) {
    return payload;
  }
}
