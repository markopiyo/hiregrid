import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { clerk } from "./middleware/auth.js";
import applicationRoutes from "./routes/applications.js";
import contactRoutes from "./routes/contacts.js";
import noteRoutes from "./routes/notes.js";
import { getAuth } from "@clerk/express";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(clerk);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/api/me", (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId });
}); //testing
app.get("/api/test", (req, res) => {
  res.json({ message: "server is alive" });
});

app.use("/api/applications", applicationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notes", noteRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server on port", process.env.PORT),
);
