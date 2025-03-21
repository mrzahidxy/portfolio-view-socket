import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import cors from "cors";
import { readVisitCount, writeVisitCount } from "./helper";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8010;

app.use(cors());

let visitCount = readVisitCount()

// Route to increment visit count
app.get("/portfolio-visit", (_req, res) => {
  visitCount++;
  writeVisitCount(visitCount);
  broadcastVisitCount();
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

  // Send current count when a client connects
  ws.send(JSON.stringify({ type: "visit_count", count: visitCount }));

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast function
const broadcastVisitCount = () => {
  const message = JSON.stringify({ type: "visit_count", count: visitCount });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
