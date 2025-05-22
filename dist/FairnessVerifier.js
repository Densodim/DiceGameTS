import crypto from "node:crypto";
export class FairnessVerifier {
    verifyHmac(value, key, hmac) {
        const expectedHmac = crypto
            .createHmac("sha3-256", key)
            .update(value.toString())
            .digest("hex");
        return hmac === expectedHmac;
    }
}
