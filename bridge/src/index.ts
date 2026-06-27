import cors from "cors";
import express from "express";
import { sessionRouter } from "./routes/session";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/session", sessionRouter);

app.listen(port, () => {
  console.log(`Bridge listening on http://localhost:${port}`);
});
