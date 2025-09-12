import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface InviteTokenPayload {
  invitationId: string;
  inviteEmail: string;
  inviterId: string;
  inviterName: string;
  inviterEmail: string;
  exp: number;
  iat: number;
}

export class InviteTokenService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
  private static readonly TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

  /**
   * Generate a secure invite token
   */
  static generateInviteToken(payload: Omit<InviteTokenPayload, 'exp' | 'iat'>): string {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: InviteTokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.TOKEN_EXPIRY
    };

    return jwt.sign(tokenPayload, this.JWT_SECRET, {
      algorithm: 'HS256',
      issuer: 'freelancer-task',
      audience: 'team-collaboration'
    });
  }

  /**
   * Verify and decode invite token
   */
  static verifyInviteToken(token: string): InviteTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'freelancer-task',
        audience: 'team-collaboration'
      }) as InviteTokenPayload;

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.log('Token expired:', { exp: decoded.exp, now });
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  }

  /**
   * Generate secure random token for additional security
   */
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Calculate expiry date (7 days from now)
   */
  static getExpiryDate(): Date {
    return new Date(Date.now() + this.TOKEN_EXPIRY * 1000);
  }

  /**
   * Check if token is expired based on date
   */
  static isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}

