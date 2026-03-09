import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Skip auth tests if no database is available
const shouldRunAuthTests = process.env.RUN_INTEGRATION_TESTS === 'true';

const describeAuth = shouldRunAuthTests ? describe : describe.skip;

describeAuth("Authentication System", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe("User Registration", () => {
    it("should create a new user with hashed password", async () => {
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      
      const user = await prisma.user.create({
        data: {
          name: testUser.name,
          email: testUser.email,
          password: hashedPassword,
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
      expect(user.password).not.toBe(testUser.password); // Should be hashed
      expect(await bcrypt.compare(testUser.password, user.password || "")).toBe(true);
    });

    it("should not allow duplicate email registration", async () => {
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      
      await expect(
        prisma.user.create({
          data: {
            name: "Another User",
            email: testUser.email,
            password: hashedPassword,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe("User Authentication", () => {
    it("should verify correct password", async () => {
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      expect(user).toBeDefined();
      const isValid = await bcrypt.compare(testUser.password, user?.password || "");
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      expect(user).toBeDefined();
      const isValid = await bcrypt.compare("wrongpassword", user?.password || "");
      expect(isValid).toBe(false);
    });
  });

  describe("Password Reset Token", () => {
    it("should create a verification token", async () => {
      const token = "test-token-123";
      const expires = new Date(Date.now() + 3600000);

      const verificationToken = await prisma.verificationToken.create({
        data: {
          identifier: testUser.email,
          token,
          expires,
        },
      });

      expect(verificationToken).toBeDefined();
      expect(verificationToken.identifier).toBe(testUser.email);
      expect(verificationToken.token).toBe(token);
    });
  });
});
