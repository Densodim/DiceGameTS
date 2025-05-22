import crypto from "node:crypto";

export class FairnessVerifier implements IFairnessVerifier {
  verifyHmac(value: number, key: Buffer, hmac: string): boolean {
    const expectedHmac = crypto
      .createHmac("sha3-256", key)
      .update(value.toString())
      .digest("hex");
    return hmac === expectedHmac;
  }
}

interface IFairnessVerifier {
  verifyHmac(value: number, key: Buffer, hmac: string): boolean;
}
