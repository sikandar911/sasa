import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "qiwa_ajeer_secret_key_2026_verification";

export interface TokenPayload {
  service: string;
  id: string;
  iat: number;
  jti?: string;
  status: string;
  start_at: string;
  end_at: string;
}

export function generateAjeerToken(data: {
  permitNumber: string;
  startDate: string;
  endDate: string;
  status?: string;
}): string {
  // Extract digits from permitNumber or use the permit number
  const numericId = data.permitNumber.replace(/\D/g, "") || data.permitNumber;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(8).toString("hex");

  const payload: TokenPayload = {
    service: "tempwork",
    id: numericId,
    iat: currentTimestamp,
    jti: nonce,
    status: data.status && data.status.includes("سار") ? "valid" : "valid",
    start_at: data.startDate,
    end_at: data.endDate,
  };

  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" });
}

export function decodeAjeerToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}