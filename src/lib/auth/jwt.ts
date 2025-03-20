import { JwtPayload, sign, verify } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  name?: string;
}

const JWT_SECRET =
  process.env.JWT_SECRET ?? "fallback-secret-key-for-development-only";

export const generateToken = (payload: Omit<TokenPayload, "iat" | "exp">) => {
  return sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
