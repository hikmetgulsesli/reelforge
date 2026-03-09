// Worker startup script for video render pipeline
import { createRenderWorker } from "../lib/render-worker.js";

console.log("Starting ReelForge Video Render Worker...");

// Create and start worker
const worker = createRenderWorker();

// Graceful shutdown
async function shutdown(): Promise<void> {
  console.log("Shutting down worker...");
  await worker.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log("Video Render Worker is running...");
console.log("Press Ctrl+C to stop.");
