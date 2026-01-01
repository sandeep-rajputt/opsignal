import bcrypt from "bcrypt";

export async function createHash(text: string) {
  return await bcrypt.hash(text, 10);
}

export async function hashCompare(text: string, hash: string) {
  return await bcrypt.compare(text, hash);
}
