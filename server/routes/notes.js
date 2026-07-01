import express from "express";
import { getAuth } from "@clerk/express";
import Note from "../models/Note.js";
import Application from "../models/Application.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/application/:applicationId", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const app = await Application.findOne({
      _id: req.params.applicationId,
      userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    const notes = await Note.find({
      applicationId: req.params.applicationId,
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const app = await Application.findOne({
      _id: req.body.applicationId,
      userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    const app = await Application.findOne({ _id: note.applicationId, userId });
    if (!app) return res.status(404).json({ error: "Application not found" });
    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
