import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db.ts';
import { User, Participant } from './types.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'codemasters_2026_veltech_secret_key_aiml';

export interface AuthPayload {
  userId: string;
  identifier: string;
  role: 'ADMIN' | 'PARTICIPANT';
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  participant?: Participant;
}

export function generateToken(user: User): string {
  const payload: AuthPayload = {
    userId: user.id,
    identifier: user.identifier,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (err) {
    return null;
  }
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return next();
  }

  const user = db.findUserById(payload.userId);
  if (user) {
    req.user = user;
    if (user.role === 'PARTICIPANT') {
      const p = db.findParticipantByUserId(user.id);
      if (p) req.participant = p;
    }
  }

  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
  }
  next();
}

export function requireParticipant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'PARTICIPANT' || !req.participant) {
    return res.status(403).json({ error: 'Access denied: Participant credentials required.' });
  }
  if (req.participant.is_disabled) {
    return res.status(403).json({ error: 'Your participant account has been locked by administrators.' });
  }
  next();
}
