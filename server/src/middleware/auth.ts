import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export interface TokenPayload {
  sub: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function authorize(...roles: readonly string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenError(
        `Role '${user.role}' is not authorized for this resource`,
      );
    }

    next();
  };
}
