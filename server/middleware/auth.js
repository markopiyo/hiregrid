import { clerkMiddleware, getAuth } from "@clerk/express";

export const clerk = clerkMiddleware({
  authorizedParties: ["http://localhost:5173"],
});

export const requireAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
