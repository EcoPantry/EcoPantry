import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET!;

export const generateToken = (
  payload: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = '1h'
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return decoded as JwtPayload;
};
