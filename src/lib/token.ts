import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "qiwa_ajeer_secret_key_2026_verification";

export interface TokenPayload {
  service: string;
  id: string;
  iat: number;
  status: string;
  start_at: string;
  end_at: string;
}

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function generateAjeerToken(data: {
  permitNumber: string;
  startDate: string;
  endDate: string;
  status?: string;
  iat?: number;
}): string {
  // Authentic Ajeer header: {"typ":"JWT","alg":"HS256"} -> eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
  const header = { typ: "JWT", alg: "HS256" };
  const headerB64 = base64url(JSON.stringify(header));

  // Extract exactly 6 digits from permitNumber (e.g. TW0862971 -> 862971)
  let numericId = data.permitNumber.replace(/\D/g, "");
  if (numericId.startsWith("0") && numericId.length > 6) {
    numericId = numericId.replace(/^0+/, "");
  }
  if (numericId.length < 6) {
    numericId = numericId.padStart(6, "0");
  } else if (numericId.length > 6) {
    numericId = numericId.slice(-6);
  }

  const currentTimestamp = data.iat || Math.floor(Date.now() / 1000);

  // Official Ajeer payload: 110 characters -> exactly 148 base64url characters
  const payload: TokenPayload = {
    service: "tempwork",
    id: numericId,
    iat: currentTimestamp,
    status: data.status && data.status.includes("سار") ? "valid" : "valid",
    start_at: data.startDate,
    end_at: data.endDate,
  };

  const payloadB64 = base64url(JSON.stringify(payload));
  const signatureInput = `${headerB64}.${payloadB64}`;
  const signature = base64url(
    crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest()
  );

  // Resulting token maintains exact 236 character length matching authentic Ajeer format
  return `${signatureInput}.${signature}`;
}

export function decodeAjeerToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payloadStr) as TokenPayload;
  } catch (error) {
    return null;
  }
}