import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { pickAvatarColor } from "@/lib/utils";

const CODE_EXPIRES_IN_MINUTES = 10;
const SEND_INTERVAL_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function createEmailVerificationCode(email: string, code: string) {
  const latestCode = await prisma.emailVerificationCode.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (latestCode && Date.now() - latestCode.createdAt.getTime() < SEND_INTERVAL_MS) {
    throw new Error("验证码发送过于频繁，请 60 秒后再试");
  }

  const codeHash = await bcrypt.hash(code, 10);

  await prisma.emailVerificationCode.create({
    data: {
      email,
      codeHash,
      expiresAt: new Date(Date.now() + CODE_EXPIRES_IN_MINUTES * 60 * 1000),
    },
  });
}

export async function verifyLoginCode(email: string, code: string) {
  const record = await prisma.emailVerificationCode.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("请先获取验证码");
  }

  if (record.usedAt) {
    throw new Error("验证码已使用，请重新获取");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw new Error("验证码已过期，请重新获取");
  }

  if (record.attemptCount >= MAX_ATTEMPTS) {
    throw new Error("验证码尝试次数过多，请重新获取");
  }

  const isValid = await bcrypt.compare(code, record.codeHash);

  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: {
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date(),
      ...(isValid ? { usedAt: new Date() } : {}),
    },
  });

  if (!isValid) {
    throw new Error("验证码错误");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      avatarColor: pickAvatarColor(email),
    },
  });

  return user;
}

export async function completeUserProfile(userId: string, username: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      username,
      NOT: { id: userId },
    },
  });

  if (existingUser) {
    throw new Error("该昵称已被占用");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { username },
  });
}
