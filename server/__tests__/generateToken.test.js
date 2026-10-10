import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const TEST_SECRET = "test_jwt_secret_for_ci";

beforeAll(() => {
   process.env.JWT_SECRET = TEST_SECRET;
});

describe("generateToken", () => {

   it("should return a string (JWT token)", () => {
      const token = generateToken("user123");
      expect(typeof token).toBe("string");
   });

   it("should contain the correct user id in the payload", () => {
      const userId = "abc123xyz";
      const token = generateToken(userId);
      const decoded = jwt.verify(token, TEST_SECRET);
      expect(decoded.id).toBe(userId);
   });

   it("should expire in 30 days", () => {
      const token = generateToken("user123");
      const decoded = jwt.decode(token);
      const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
      const diff = decoded.exp - decoded.iat;
      expect(diff).toBe(thirtyDaysInSeconds);
   });

   it("should fail verification with a wrong secret", () => {
      const token = generateToken("user123");
      expect(() => jwt.verify(token, "wrong_secret")).toThrow();
   });

});
