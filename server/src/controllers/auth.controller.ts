import { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/core";
import { env } from "../config/env";
import { loginBodySchema } from "../validators/auth.validator";
import { UnauthorizedError } from "../utils/errors";
import type { TokenPayload } from "../middleware/auth";

function signToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

function toAccountResponse(account: {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: account.id,
    username: account.username,
    role: account.role,
    status: account.status,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export async function login(req: Request, res: Response): Promise<void> {
  const body = loginBodySchema.parse(req.body);

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.username, body.username))
    .limit(1);

  if (!account) {
    throw new UnauthorizedError("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(body.password, account.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid username or password");
  }

  if (account.status !== "active") {
    throw new UnauthorizedError("Account is not active");
  }

  const tokenPayload: TokenPayload = {
    sub: account.id,
    username: account.username,
    role: account.role,
  };

  const token = signToken(tokenPayload);

  res.status(200).json({
    success: true,
    data: {
      token,
      account: toAccountResponse(account),
    },
  });
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, user.sub))
    .limit(1);

  if (!account) {
    throw new UnauthorizedError("Account not found");
  }

  res.status(200).json({
    success: true,
    data: toAccountResponse(account),
  });
}
