import crypto from "node:crypto";
export class RandomGenerator {
    generateSecureKey() {
        return crypto.randomBytes(32);
    }
    generateRandomNumber(rangeMax, key) {
        const value = crypto.randomInt(0, rangeMax + 1);
        const hmac = crypto
            .createHmac("sha3-256", key)
            .update(value.toString())
            .digest("hex");
        return [value, hmac];
    }
}
