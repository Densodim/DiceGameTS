import crypto from "node:crypto";

interface IRandomGenerator {
  generateSecureKey(): Buffer;
  generateRandomNumber(rangeMax: number, key: Buffer): [number, string];
}

export class RandomGenerator implements IRandomGenerator {
  generateSecureKey(): Buffer {
    return crypto.randomBytes(32);
  }

  generateRandomNumber(rangeMax: number, key: Buffer): [number, string] {
    const value = crypto.randomInt(0, rangeMax + 1);
    const hmac = crypto
      .createHmac("sha3-256", key)
      .update(value.toString())
      .digest("hex");
    return [value, hmac];
  }
}
