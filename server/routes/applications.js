import express from "express";
import { getAuth } from "@clerk/express";
import Application from "../models/Application.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const apps = await Application.find({ userId }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const app = await Application.findOne({ _id: req.params.id, userId });
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const app = await Application.create({ ...req.body, userId });
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const app = await Application.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
