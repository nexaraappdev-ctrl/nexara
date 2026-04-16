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

// ---------------- STATE ----------------
const waitingUsers = [];
const activePairs = new Map(); // socketId -> partnerId

function removeFromQueue(socketId) {
  const idx = waitingUsers.findIndex((u) => u.socketId === socketId);
  if (idx !== -1) waitingUsers.splice(idx, 1);
}

function clearPair(socketId) {
  const partnerId = activePairs.get(socketId);

  if (partnerId) {
    activePairs.delete(partnerId);
    activePairs.delete(socketId);
    return partnerId;
  }

  activePairs.delete(socketId);
  return null;
}

// ---------------- SOCKET ----------------
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // ---------------- MATCHMAKING ----------------
  socket.on("find-partner", (userData = {}) => {
    removeFromQueue(socket.id);

    const partner = waitingUsers.shift();

    if (partner && partner.socketId !== socket.id) {
      activePairs.set(socket.id, partner.socketId);
      activePairs.set(partner.socketId, socket.id);

      io.to(socket.id).emit("matched", {
        partnerId: partner.socketId,
        initiator: true,
        partnerName: partner.displayName || "Stranger",
      });

      io.to(partner.socketId).emit("matched", {
        partnerId: socket.id,
        initiator: false,
        partnerName: userData.displayName || "Stranger",
      });

    } else {
      waitingUsers.push({
        socketId: socket.id,
        displayName: userData.displayName || "Stranger",
      });

      socket.emit("waiting");
    }
  });

  // ---------------- WEBRTC SIGNALING ----------------
  socket.on("signal", ({ to, data }) => {
    if (!to) return;
    io.to(to).emit("signal", {
      from: socket.id,
      data,
    });
  });

  // ---------------- CHAT ----------------
  socket.on("chat-message", ({ to, message, displayName }) => {
    if (!to) return;

    io.to(to).emit("chat-message", {
      message,
      displayName,
      from: socket.id,
    });
  });

  // ---------------- SKIP ----------------
  socket.on("skip", () => {
    const partnerId = clearPair(socket.id);

    if (partnerId) {
      io.to(partnerId).emit("partner-disconnected");
    }

    removeFromQueue(socket.id);

    socket.emit("skipped");
  });

  // ---------------- DISCONNECT ----------------
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    const partnerId = clearPair(socket.id);

    if (partnerId) {
      io.to(partnerId).emit("partner-disconnected");
    }

    removeFromQueue(socket.id);
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});