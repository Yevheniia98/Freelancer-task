"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleUsage = exampleUsage;
// Example usage of SecurityService in auth controller
const security_service_1 = require("../services/security.service");
async function exampleUsage() {
    // Initialize the security service
    const securityService = security_service_1.SecurityService.getInstance();
    await securityService.initialize();
    // Example 1: Password validation
    const passwordStrength = securityService.validatePassword('MyPassword123!', {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe'
    });
    if (!passwordStrength.isValid) {
        console.log('Password feedback:', passwordStrength.feedback);
    }
    // Example 2: Check if account is locked
    const lockStatus = await securityService.isAccountLocked('user@example.com', '192.168.1.100');
    if (lockStatus.locked) {
        console.log(`Account locked for ${lockStatus.remainingTime} minutes`);
    }
    // Example 3: Record login attempt
    await securityService.recordLoginAttempt({
        email: 'user@example.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(),
        success: false,
        failureReason: 'Invalid password'
    });
    // Example 4: Generate and verify verification codes
    const code = await securityService.createVerificationCode('email', 'user@example.com', 15);
    console.log('Verification code:', code);
    const verificationResult = await securityService.verifyCode('email', 'user@example.com', code);
    if (verificationResult.valid) {
        console.log('Code verified successfully');
    }
    // Example 5: Check suspicious requests (in middleware)
    // const suspiciousCheck = await securityService.isSuspiciousRequest(req);
    // if (suspiciousCheck.suspicious) {
    //   console.log('Suspicious request detected:', suspiciousCheck.reasons);
    // }
    // Example 6: Generate tokens
    const accessToken = securityService.generateToken('user-id-123');
    const refreshToken = securityService.generateRefreshToken('user-id-123');
    // Example 7: Get security metrics
    const metrics = await securityService.getSecurityMetrics();
    console.log('Security metrics:', metrics);
}
// Uncomment the line below to run the example
// exampleUsage().catch(console.error);
