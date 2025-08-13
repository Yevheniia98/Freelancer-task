export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-100
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  errors: string[];
  suggestions: string[];
}

export interface PasswordOptions {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  requireNoCommonPatterns?: boolean;
  requireNoUserInfo?: boolean;
  minUniqueChars?: number;
}

export class PasswordValidator {
  private static readonly DEFAULT_OPTIONS: PasswordOptions = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    requireNoCommonPatterns: true,
    requireNoUserInfo: true,
    minUniqueChars: 6
  };

  private static readonly COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'hello', 'login', 'pass', 'shadow',
    'superman', 'princess', 'sunshine', 'iloveyou'
  ];

  private static readonly COMMON_PATTERNS = [
    /^(.)\1+$/, // Same character repeated
    /^(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)+/,
    /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i,
    /^(qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm)+/i
  ];

  public static validate(
    password: string, 
    options: Partial<PasswordOptions> = {},
    userInfo?: { email?: string; firstName?: string; lastName?: string; username?: string }
  ): PasswordValidationResult {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const errors: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Basic length validation
    if (password.length < opts.minLength!) {
      errors.push(`Password must be at least ${opts.minLength} characters long`);
      suggestions.push(`Add ${opts.minLength! - password.length} more characters`);
    } else {
      score += Math.min(25, (password.length / opts.minLength!) * 10);
    }

    if (password.length > opts.maxLength!) {
      errors.push(`Password must not exceed ${opts.maxLength} characters`);
    }

    // Character type validation
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

    if (opts.requireUppercase && !hasUppercase) {
      errors.push('Password must contain at least one uppercase letter');
      suggestions.push('Add uppercase letters (A-Z)');
    } else if (hasUppercase) {
      score += 15;
    }

    if (opts.requireLowercase && !hasLowercase) {
      errors.push('Password must contain at least one lowercase letter');
      suggestions.push('Add lowercase letters (a-z)');
    } else if (hasLowercase) {
      score += 15;
    }

    if (opts.requireNumbers && !hasNumbers) {
      errors.push('Password must contain at least one number');
      suggestions.push('Add numbers (0-9)');
    } else if (hasNumbers) {
      score += 15;
    }

    if (opts.requireSpecialChars && !hasSpecialChars) {
      errors.push('Password must contain at least one special character');
      suggestions.push('Add special characters (!@#$%^&*)');
    } else if (hasSpecialChars) {
      score += 15;
    }

    // Unique characters validation
    const uniqueChars = new Set(password.toLowerCase()).size;
    if (opts.minUniqueChars && uniqueChars < opts.minUniqueChars) {
      errors.push(`Password must contain at least ${opts.minUniqueChars} unique characters`);
      suggestions.push('Use more varied characters');
    } else {
      score += Math.min(10, (uniqueChars / password.length) * 20);
    }

    // Common password validation
    if (opts.requireNoCommonPatterns) {
      const lowerPassword = password.toLowerCase();
      
      // Check against common passwords
      if (this.COMMON_PASSWORDS.includes(lowerPassword)) {
        errors.push('Password is too common');
        suggestions.push('Use a more unique password');
        score -= 30;
      }

      // Check against common patterns
      for (const pattern of this.COMMON_PATTERNS) {
        if (pattern.test(password)) {
          errors.push('Password contains common patterns');
          suggestions.push('Avoid sequential or repetitive patterns');
          score -= 20;
          break;
        }
      }

      // Check for keyboard patterns - DISABLED
      // if (this.hasKeyboardPattern(password)) {
      //   errors.push('Password contains keyboard patterns');
      //   suggestions.push('Avoid patterns like "qwerty" or "asdf"');
      //   score -= 15;
      // }
    }

    // User information validation
    if (opts.requireNoUserInfo && userInfo) {
      const userValues = [
        userInfo.email?.toLowerCase(),
        userInfo.firstName?.toLowerCase(),
        userInfo.lastName?.toLowerCase(),
        userInfo.username?.toLowerCase()
      ].filter(Boolean);

      for (const value of userValues) {
        if (value && password.toLowerCase().includes(value)) {
          errors.push('Password should not contain personal information');
          suggestions.push('Avoid using your name, email, or username');
          score -= 25;
          break;
        }
      }
    }

    // Additional entropy checks
    score += this.calculateEntropyBonus(password);

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine strength level
    const strength = this.getStrengthLevel(score);

    return {
      isValid: errors.length === 0,
      score,
      strength,
      errors,
      suggestions
    };
  }

  private static hasKeyboardPattern(password: string): boolean {
    const keyboardRows = [
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
      '1234567890'
    ];

    const lowerPassword = password.toLowerCase();
    
    for (const row of keyboardRows) {
      for (let i = 0; i <= row.length - 3; i++) {
        const pattern = row.substring(i, i + 3);
        const reversePattern = pattern.split('').reverse().join('');
        
        if (lowerPassword.includes(pattern) || lowerPassword.includes(reversePattern)) {
          return true;
        }
      }
    }
    
    return false;
  }

  private static calculateEntropyBonus(password: string): number {
    // Calculate character space
    let charSpace = 0;
    if (/[a-z]/.test(password)) charSpace += 26;
    if (/[A-Z]/.test(password)) charSpace += 26;
    if (/\d/.test(password)) charSpace += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) charSpace += 32;

    // Calculate entropy
    const entropy = password.length * Math.log2(charSpace);
    
    // Bonus for high entropy
    if (entropy > 60) return 10;
    if (entropy > 50) return 5;
    return 0;
  }

  private static getStrengthLevel(score: number): 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' {
    if (score >= 80) return 'strong';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'weak';
    return 'very-weak';
  }

  public static generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  public static getPasswordStrengthColor(strength: string): string {
    switch (strength) {
      case 'very-weak': return '#ff4444';
      case 'weak': return '#ff8800';
      case 'fair': return '#ffaa00';
      case 'good': return '#88cc00';
      case 'strong': return '#00cc44';
      default: return '#cccccc';
    }
  }

  public static getPasswordStrengthText(strength: string): string {
    switch (strength) {
      case 'very-weak': return 'Very Weak';
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
      default: return 'Unknown';
    }
  }
}