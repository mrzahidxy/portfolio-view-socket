import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import cors from "cors";
import { incrementVisitCount, readVisitCount } from "./helper";
import mongoose from "mongoose";

dotenv.config();


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Express setup
const app = express();
const PORT = process.env.PORT ?? 8010;

app.use(cors());

// Route to increment visit count
app.get("/portfolio-visit", async (_req, res) => {
  const visitCount = await readVisitCount();
  incrementVisitCount();
  broadcastVisitCount(visitCount);
  res.json({ message: `Portfolio visited ${visitCount} times.` });
});

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast function
const broadcastVisitCount = (visitCount: number) => {
  const message = JSON.stringify({ type: "visit_count", count: visitCount });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
