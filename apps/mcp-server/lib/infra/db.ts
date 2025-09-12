import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export async function createSession(data: {
  userId?: string;
  sessionType: string;
  status: string;
  metadata?: any;
  expiresAt?: Date;
}) {
  return await db.session.create({
    data,
  });
}

export async function updateSession(id: string, data: {
  status?: string;
  metadata?: any;
  expiresAt?: Date;
}) {
  return await db.session.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

export async function createRun(data: {
  sessionId: string;
  runType: string;
  status: string;
  inputHash: string;
  inputParams: any;
  idempotencyKey?: string;
}) {
  return await db.run.create({
    data,
  });
}

export async function updateRun(id: string, data: {
  status?: string;
  outputData?: any;
  summary?: string;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
}) {
  return await db.run.update({
    where: { id },
    data,
  });
}

export async function createArtifact(data: {
  runId: string;
  artifactType: string;
  fileName: string;
  fileUrl: string;
  fileHash: string;
  fileSize?: number;
  mimeType: string;
  expiresAt?: Date;
}) {
  return await db.artifact.create({
    data,
  });
}

export async function createSurveyResponse(data: {
  runId: string;
  userId?: string;
  responses: any;
  sectionScores?: any;
  totalScore?: number;
  deliveryFormat: string[];
  notifyEmails: string[];
}) {
  return await db.surveyResponse.create({
    data,
  });
}

export async function logAuditEvent(data: {
  runId?: string;
  sessionId?: string;
  eventType: string;
  eventData: any;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  legalRefs?: string[];
}) {
  return await db.auditLog.create({
    data,
  });
}

export async function findRunByIdempotencyKey(idempotencyKey: string) {
  return await db.run.findUnique({
    where: { idempotencyKey },
    include: {
      artifacts: true,
      session: true,
    },
  });
}

export async function createIdempotencyRecord(data: {
  idempotencyKey: string;
  runId: string;
  expiresAt: Date;
}) {
  return await db.idempotencyRecord.create({
    data,
  });
}

export async function cleanExpiredIdempotencyRecords() {
  const now = new Date();
  return await db.idempotencyRecord.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
}