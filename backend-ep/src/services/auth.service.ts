import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { sendVerificationCode } from '../lib/mailer';
import { generateToken } from '../lib/jwt';

export const signupInitiate = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.verified) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });

  const code = String(randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await prisma.emailVerificationCode.create({
    data: { email, code, purpose: 'signup', expiresAt },
  });

  // Send code via email (placeholder)
  console.log(`Verification code for ${email}: ${code}`);
  await sendVerificationCode(email, code);

  return { message: 'Verification code sent' };
};

export const signupVerify = async (email: string, code: string) => {
  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      code,
      purpose: 'signup',
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) throw new Error('Invalid or expired code');

  const user = await prisma.user.update({
    where: { email },
    data: { verified: true },
  });

  await prisma.emailVerificationCode.delete({
    where: { id: record.id },
  });

  return { message: 'Signup successful', user };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password || !user.verified) {
    throw new Error('Invalid credentials or unverified account');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    message: 'Logged in',
    token,
    user: {
      id: user.id,
      email: user.email,
      verified: user.verified
    }
  };
};

export const logout = async () => {
  // Logic depends on token/session implementation
  return { message: 'Logout successful (no-op placeholder)' };
};
