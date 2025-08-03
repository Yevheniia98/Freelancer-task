import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export class TwoFactorService {
  public async generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `Task Manager (${email})`,
      issuer: 'Task Manager',
      length: 32
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32!,
      qrCodeUrl
    };
  }

  public verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });
  }
}