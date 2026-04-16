const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "Nexara backend running" })
);

// --- Matchmaking queue ---
const waitingUsers = [];
const activePairs = new Map();

function removeFromQueue(socketId) {
  const idx = waitingUsers.findIndex((u) => u.socketId === socketId);
  if (idx !== -1) waitingUsers.splice(idx, 1);
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // ---------------- MATCHMAKING ----------------
  socket.on("find-partner", (userData) => {
    removeFromQueue(socket.id);

    // FIFO matchmaking (FIXED)
    const partner = waitingUsers.shift();

    if (partner && partner.socketId !== socket.id) {
      activePairs.set(socket.id, partner.socketId);
      activePairs.set(partner.socketId, socket.id);

      io.to(socket.id).emit("matched", {
        partnerId: partner.socketId,
        initiator: true,
        partnerName: partner.displayName,
      });

      io.to(partner.socketId).emit("matched", {
        partnerId: socket.id,
        initiator: false,
        partnerName: userData.displayName,
      });
    } else {
      waitingUsers.push({ socketId: socket.id, ...userData });
      socket.emit("waiting");
    }
  });

  // ---------------- WEBRTC SIGNALING ----------------
  socket.on("signal", ({ to, data }) => {
    io.to(to).emit("signal", { from: socket.id, data });
  });

  // ---------------- CHAT ----------------
  socket.on("chat-message", ({ to, message, displayName }) => {
    io.to(to).emit("chat-message", {
      message,
      displayName,
      from: socket.id,
    });
  });

  // ---------------- SKIP ----------------
  socket.on("skip", () => {
    const partnerId = activePairs.get(socket.id);

    if (partnerId) {
      io.to(partnerId).emit("partner-disconnected");

      activePairs.delete(partnerId);
      activePairs.delete(socket.id);
    } else {
      activePairs.delete(socket.id);
    }

    removeFromQueue(socket.id);
    socket.emit("skipped");
  });

  // ---------------- DISCONNECT ----------------
  socket.on("disconnect", () => {
    const partnerId = activePairs.get(socket.id);

    if (partnerId) {
      io.to(partnerId).emit("partner-disconnected");
      activePairs.delete(partnerId);
    }

    activePairs.delete(socket.id);
    removeFromQueue(socket.id);

    console.log("Disconnected:", socket.id);
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});