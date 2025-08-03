import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';

export interface SSLCertificateOptions {
  commonName?: string;
  country?: string;
  state?: string;
  locality?: string;
  organization?: string;
  organizationalUnit?: string;
  emailAddress?: string;
  validityDays?: number;
  keySize?: number;
  altNames?: string[];
}

export interface SSLCertificate {
  privateKey: string;
  publicKey: string;
  certificate: string;
  csr?: string;
}

export interface SSLFiles {
  privateKeyPath: string;
  certificatePath: string;
  csrPath?: string;
}

export class SSLGenerator {
  private static readonly DEFAULT_OPTIONS: Required<Omit<SSLCertificateOptions, 'altNames'>> & { altNames: string[] } = {
    commonName: 'localhost',
    country: 'US',
    state: 'California',
    locality: 'San Francisco',
    organization: 'Task Manager',
    organizationalUnit: 'IT Department',
    emailAddress: 'admin@taskmanager.local',
    validityDays: 365,
    keySize: 2048,
    altNames: ['localhost', '127.0.0.1', '::1']
  };

  /**
   * Generate a self-signed SSL certificate
   */
  public static generateSelfSignedCertificate(options: SSLCertificateOptions = {}): SSLCertificate {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    // Generate RSA key pair
    const keys = forge.pki.rsa.generateKeyPair(opts.keySize);
    
    // Create certificate
    const cert = forge.pki.createCertificate();
    
    // Set certificate fields
    cert.publicKey = keys.publicKey;
    cert.serialNumber = this.generateSerialNumber();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + opts.validityDays);

    // Set subject attributes
    const attrs = [
      { name: 'commonName', value: opts.commonName },
      { name: 'countryName', value: opts.country },
      { name: 'stateOrProvinceName', value: opts.state },
      { name: 'localityName', value: opts.locality },
      { name: 'organizationName', value: opts.organization },
      { name: 'organizationalUnitName', value: opts.organizationalUnit }
    ];

    if (opts.emailAddress) {
      attrs.push({ name: 'emailAddress', value: opts.emailAddress });
    }

    cert.setSubject(attrs);
    cert.setIssuer(attrs); // Self-signed, so issuer = subject

    // Add extensions
    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: false
      },
      {
        name: 'keyUsage',
        keyCertSign: false,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: false,
        emailProtection: false,
        timeStamping: false
      },
      {
        name: 'nsCertType',
        client: true,
        server: true,
        email: false,
        objsign: false,
        sslCA: false,
        emailCA: false,
        objCA: false
      },
      {
        name: 'subjectAltName',
        altNames: opts.altNames.map(name => {
          if (this.isIPAddress(name)) {
            return { type: 7, ip: name }; // IP address
          } else {
            return { type: 2, value: name }; // DNS name
          }
        })
      }
    ]);

    // Sign certificate
    cert.sign(keys.privateKey);

    return {
      privateKey: forge.pki.privateKeyToPem(keys.privateKey),
      publicKey: forge.pki.publicKeyToPem(keys.publicKey),
      certificate: forge.pki.certificateToPem(cert)
    };
  }

  /**
   * Generate a Certificate Signing Request (CSR)
   */
  public static generateCSR(options: SSLCertificateOptions = {}): { privateKey: string; csr: string } {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    // Generate RSA key pair
    const keys = forge.pki.rsa.generateKeyPair(opts.keySize);
    
    // Create CSR
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;

    // Set subject attributes
    const attrs = [
      { name: 'commonName', value: opts.commonName },
      { name: 'countryName', value: opts.country },
      { name: 'stateOrProvinceName', value: opts.state },
      { name: 'localityName', value: opts.locality },
      { name: 'organizationName', value: opts.organization },
      { name: 'organizationalUnitName', value: opts.organizationalUnit }
    ];

    if (opts.emailAddress) {
      attrs.push({ name: 'emailAddress', value: opts.emailAddress });
    }

    csr.setSubject(attrs);

    // Add extensions
    csr.setAttributes([
      {
        name: 'challengePassword',
        value: 'password'
      },
      {
        name: 'unstructuredName',
        value: 'Task Manager SSL'
      },
      {
        name: 'extensionRequest',
        extensions: [
          {
            name: 'subjectAltName',
            altNames: opts.altNames.map(name => {
              if (this.isIPAddress(name)) {
                return { type: 7, ip: name };
              } else {
                return { type: 2, value: name };
              }
            })
          }
        ]
      }
    ]);

    // Sign CSR
    csr.sign(keys.privateKey);

    return {
      privateKey: forge.pki.privateKeyToPem(keys.privateKey),
      csr: forge.pki.certificationRequestToPem(csr)
    };
  }

  /**
   * Save SSL certificate files to disk
   */
  public static async saveCertificateFiles(
    certificate: SSLCertificate,
    outputDir: string,
    filename: string = 'server'
  ): Promise<SSLFiles> {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const privateKeyPath = path.join(outputDir, `${filename}.key`);
    const certificatePath = path.join(outputDir, `${filename}.crt`);
    const csrPath = certificate.csr ? path.join(outputDir, `${filename}.csr`) : undefined;

    // Write files
    fs.writeFileSync(privateKeyPath, certificate.privateKey);
    fs.writeFileSync(certificatePath, certificate.certificate);
    
    if (certificate.csr && csrPath) {
      fs.writeFileSync(csrPath, certificate.csr);
    }

    // Set appropriate permissions
    fs.chmodSync(privateKeyPath, 0o600); // Private key should be readable only by owner
    fs.chmodSync(certificatePath, 0o644); // Certificate can be readable by others

    return {
      privateKeyPath,
      certificatePath,
      csrPath
    };
  }

  /**
   * Load SSL certificate files from disk
   */
  public static loadCertificateFiles(
    privateKeyPath: string,
    certificatePath: string,
    csrPath?: string
  ): SSLCertificate {
    if (!fs.existsSync(privateKeyPath)) {
      throw new Error(`Private key file not found: ${privateKeyPath}`);
    }

    if (!fs.existsSync(certificatePath)) {
      throw new Error(`Certificate file not found: ${certificatePath}`);
    }

    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');
    
    let csr: string | undefined;
    if (csrPath && fs.existsSync(csrPath)) {
      csr = fs.readFileSync(csrPath, 'utf8');
    }

    return {
      privateKey,
      publicKey: this.extractPublicKeyFromCertificate(certificate),
      certificate,
      csr
    };
  }

  /**
   * Validate SSL certificate
   */
  public static validateCertificate(certificatePem: string): {
    isValid: boolean;
    subject: any;
    issuer: any;
    validFrom: Date;
    validTo: Date;
    serialNumber: string;
    fingerprint: string;
    isExpired: boolean;
    daysUntilExpiry: number;
  } {
    try {
      const cert = forge.pki.certificateFromPem(certificatePem);
      const now = new Date();
      const isExpired = now > cert.validity.notAfter;
      const daysUntilExpiry = Math.ceil((cert.validity.notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Generate fingerprint
      const md = forge.md.sha256.create();
      md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes());
      const fingerprint = md.digest().toHex().toUpperCase().replace(/(.{2})/g, '$1:').slice(0, -1);

      return {
        isValid: true,
        subject: cert.subject.attributes.reduce((acc: any, attr: any) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
        issuer: cert.issuer.attributes.reduce((acc: any, attr: any) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
        validFrom: cert.validity.notBefore,
        validTo: cert.validity.notAfter,
        serialNumber: cert.serialNumber,
        fingerprint,
        isExpired,
        daysUntilExpiry
      };
    } catch (error) {
      return {
        isValid: false,
        subject: {},
        issuer: {},
        validFrom: new Date(),
        validTo: new Date(),
        serialNumber: '',
        fingerprint: '',
        isExpired: true,
        daysUntilExpiry: 0
      };
    }
  }

  /**
   * Generate development SSL certificates for Express.js
   */
  public static async generateForExpress(
    outputDir: string = './ssl',
    options: SSLCertificateOptions = {}
  ): Promise<{ key: string; cert: string; files: SSLFiles }> {
    const certificate = this.generateSelfSignedCertificate({
      commonName: 'localhost',
      altNames: ['localhost', '127.0.0.1', '::1'],
      validityDays: 365,
      ...options
    });

    const files = await this.saveCertificateFiles(certificate, outputDir, 'server');

    return {
      key: certificate.privateKey,
      cert: certificate.certificate,
      files
    };
  }

  /**
   * Check if SSL certificates exist and are valid
   */
  public static checkCertificatesExist(
    privateKeyPath: string,
    certificatePath: string
  ): { exist: boolean; valid: boolean; daysUntilExpiry?: number } {
    try {
      if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certificatePath)) {
        return { exist: false, valid: false };
      }

      const certificate = fs.readFileSync(certificatePath, 'utf8');
      const validation = this.validateCertificate(certificate);

      return {
        exist: true,
        valid: validation.isValid && !validation.isExpired,
        daysUntilExpiry: validation.daysUntilExpiry
      };
    } catch (error) {
      return { exist: false, valid: false };
    }
  }

  private static generateSerialNumber(): string {
    return Math.floor(Math.random() * 0xffffffff).toString(16);
  }

  private static isIPAddress(str: string): boolean {
    // Simple IP address detection
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$/;
    return ipv4Regex.test(str) || ipv6Regex.test(str);
  }

  private static extractPublicKeyFromCertificate(certificatePem: string): string {
    try {
      const cert = forge.pki.certificateFromPem(certificatePem);
      return forge.pki.publicKeyToPem(cert.publicKey);
    } catch (error) {
      throw new Error('Failed to extract public key from certificate');
    }
  }
}