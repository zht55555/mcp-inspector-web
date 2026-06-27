import cors from "cors";
import express from "express";
import { sessionRouter } from "./routes/session";
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

app.listen(port, () => {
  console.log(`Bridge listening on http://localhost:${port}`);
});
