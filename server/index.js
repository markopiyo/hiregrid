import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { clerk } from "./middleware/auth.js";

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
  res.json({ userId: req.auth?.userId });
});

app.listen(process.env.PORT, () =>
  console.log("Server on port", process.env.PORT),
);
