// Serviço de criptografia AES-256-GCM para tokens OAuth
// NUNCA armazena tokens em texto plano — sempre encriptografados
import crypto from "crypto";

// Chave de criptografia — em produção, viria de variável de ambiente segura
// NUNCA hardcode em produção
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

// Obtém a chave de criptografia das variáveis de ambiente
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    // Em desenvolvimento, usa uma chave derivada (NUNCA em produção)
    if (process.env.NODE_ENV === "production") {
      throw new Error("ENCRYPTION_KEY deve ser uma chave hex de 64 caracteres (256 bits)");
    }
    // Chave padrão para dev — NUNCA usar em produção
    return Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000000",
      "hex"
    );
  }
  return Buffer.from(keyHex, "hex");
}

// Resultado da encriptação — armazenado separadamente no banco
export interface EncryptedData {
  encrypted: string;   // Dados encriptografados em hex
  iv: string;          // Vetor de inicialização em hex
  authTag: string;     // Auth tag GCM em hex
}

// Encriptografa um texto usando AES-256-GCM
export function encrypt(plaintext: string): EncryptedData {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

// Desencriptografa dados encriptografados com AES-256-GCM
export function decrypt(encryptedData: EncryptedData): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(encryptedData.iv, "hex");
  const authTag = Buffer.from(encryptedData.authTag, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Gera uma chave de criptografia aleatória (para setup inicial)
// Rode uma vez: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Verifica se um token precisa ser renovado (expira em menos de 5 minutos)
export function isTokenExpiringSoon(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  const fiveMinutes = 5 * 60 * 1000;
  return new Date(expiresAt).getTime() - Date.now() < fiveMinutes;
}
