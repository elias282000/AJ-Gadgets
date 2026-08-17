import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";
export const ADMIN_SESSION_COOKIE = "aj_admin_session";

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set. Add it to .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  sub: string;
  username: string;
}

export async function createAdminSessionToken(
  payload: AdminSessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.username !== "string") {
      return null;
    }
    return { sub: payload.sub, username: payload.username };
  } catch {
    return null;
  }
}
