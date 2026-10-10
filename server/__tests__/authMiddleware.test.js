import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock jsonwebtoken and User model before importing the middleware
vi.mock("jsonwebtoken", () => ({
   default: {
      verify: vi.fn()
   }
}));

vi.mock("../models/user.js", () => ({
   default: {
      findById: vi.fn()
   }
}));

import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { protect, admin, adminOrLibrarian } from "../middlewares/authMiddleware.js";

// Helper to create mock req/res/next
const mockRes = () => {
   const res = {};
   res.status = vi.fn().mockReturnValue(res);
   res.json = vi.fn().mockReturnValue(res);
   return res;
};

describe("protect middleware", () => {

   beforeEach(() => vi.clearAllMocks());

   it("should return 401 if no token is provided", async () => {
      const req = { headers: {} };
      const res = mockRes();
      const next = vi.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
   });

   it("should return 401 if token verification fails", async () => {
      jwt.verify.mockImplementation(() => { throw new Error("invalid token"); });

      const req = { headers: { authorization: "Bearer badtoken" } };
      const res = mockRes();
      const next = vi.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
   });

   it("should call next() and attach user if token is valid", async () => {
      const fakeUser = { _id: "user123", name: "Swastik", role: "user" };
      jwt.verify.mockReturnValue({ id: "user123" });
      User.findById.mockReturnValue({
         select: vi.fn().mockResolvedValue(fakeUser)
      });

      const req = { headers: { authorization: "Bearer validtoken" } };
      const res = mockRes();
      const next = vi.fn();

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(fakeUser);
   });

});

describe("admin middleware", () => {

   it("should call next() for admin users", () => {
      const req = { user: { role: "admin" } };
      const res = mockRes();
      const next = vi.fn();

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
   });

   it("should return 403 for non-admin users", () => {
      const req = { user: { role: "user" } };
      const res = mockRes();
      const next = vi.fn();

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
   });

});

describe("adminOrLibrarian middleware", () => {

   it("should call next() for librarian", () => {
      const req = { user: { role: "librarian" } };
      const res = mockRes();
      const next = vi.fn();
      adminOrLibrarian(req, res, next);
      expect(next).toHaveBeenCalled();
   });

   it("should call next() for admin", () => {
      const req = { user: { role: "admin" } };
      const res = mockRes();
      const next = vi.fn();
      adminOrLibrarian(req, res, next);
      expect(next).toHaveBeenCalled();
   });

   it("should return 403 for regular user", () => {
      const req = { user: { role: "user" } };
      const res = mockRes();
      const next = vi.fn();
      adminOrLibrarian(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
   });

});
