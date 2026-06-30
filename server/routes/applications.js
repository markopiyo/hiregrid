import express from "express";
import Application from "../models/Application.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth); // protect all routes below

// GET all applications for logged-in user
router.get("/", async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.auth.userId }).sort({
      createdAt: -1,
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single application
router.get("/:id", async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      userId: req.auth.userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new application
router.post("/", async (req, res) => {
  try {
    const app = await Application.create({
      ...req.body,
      userId: req.auth.userId,
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update application
router.put("/:id", async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE application
router.delete("/:id", async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
