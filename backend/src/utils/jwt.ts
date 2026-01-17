import jwt, {
  type SignOptions,
  type Secret,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

type TokenResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export function createToken({
  key,
  data,
  expiresIn = "15m",
}: {
  key: Secret;
  data: Record<string, unknown>;
  expiresIn?: SignOptions["expiresIn"];
}): TokenResult<string> {
  try {
    const token = jwt.sign(data, key, { expiresIn });
    return { success: true, data: token };
  } catch {
    return { success: false, error: "TOKEN_CREATION_FAILED" };
  }
}

export function verifyToken({
  token,
  secret,
}: {
  token: string;
  secret: Secret;
}): TokenResult<Record<string, unknown>> {
  try {
    const payload = jwt.verify(token, secret) as Record<string, unknown>;
    return { success: true, data: payload };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return { success: false, error: "TOKEN_EXPIRED" };
    }

    if (err instanceof JsonWebTokenError) {
      return { success: false, error: "INVALID_TOKEN" };
    }

    return { success: false, error: "TOKEN_VERIFICATION_FAILED" };
  }
}
