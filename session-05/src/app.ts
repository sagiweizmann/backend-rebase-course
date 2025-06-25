import express from "express";
import internalRoutes from "./routes/internal";
import blobsRoutes from "./routes/blobs";
import { logger } from "./utils/logger";

export const REGISTRATION_DURATION_SECONDS = 20;
export const START_TIME = Date.now();

export function isRegistrationOpen(): boolean {
  return ((Date.now() - START_TIME) / 1000) < REGISTRATION_DURATION_SECONDS;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Simple request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/internal", internalRoutes);
app.use("/blobs", blobsRoutes);

app.listen(PORT, () => {
  logger.info(`Load Balancer listening on port ${PORT}`);
});

export default app;
