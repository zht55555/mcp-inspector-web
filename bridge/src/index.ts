import cors from "cors";
import express from "express";
import { callRouter } from "./routes/call";
import { sessionRouter } from "./routes/session";
import { streamRouter } from "./routes/stream";
import { toolsRouter } from "./routes/tools";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/session", sessionRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/call", callRouter);
app.use("/api/events/stream", streamRouter);

app.listen(port, () => {
  console.log(`Bridge listening on http://localhost:${port}`);
});
