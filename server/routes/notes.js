import express from "express";
import Note from "../models/Note.js";
import Application from "../models/Application.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

// GET all notes for an application (only if the application belongs to the user)
router.get("/application/:applicationId", async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.applicationId,
      userId: req.auth.userId,
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

// POST new note (only if the parent application belongs to the user)
router.post("/", async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.body.applicationId,
      userId: req.auth.userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });

    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE note (only if its parent application belongs to the user)
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const app = await Application.findOne({
      _id: note.applicationId,
      userId: req.auth.userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });

    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
