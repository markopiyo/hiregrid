import express from "express";
import { getAuth } from "@clerk/express";
import Contact from "../models/Contact.js";
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
    const contacts = await Contact.find({
      applicationId: req.params.applicationId,
    });
    res.json(contacts);
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
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    const app = await Application.findOne({
      _id: contact.applicationId,
      userId,
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    await contact.deleteOne();
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
