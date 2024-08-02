import http from "http";
import express from "express";

import socketio from "socket.io";

const app = express();
const expressServer = http.createServer(app);
const io = new socketio.Server(expressServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("message", (message: string) => {
    let request: { event: string; data: any; api_key: string };
    try {
      request = JSON.parse(message);
    } catch (e) {
      request = message as unknown as {
        event: string;
        data: any;
        api_key: string;
      };
    }

    if (!request.event || !request.data || !request.api_key) {
      return;
    }

    for (const [key, value] of Object.entries(request.data)) {
      if (typeof request.data[key] == "string")
        request.data[key] = request.data[key].replace(//g, ""); // replace any unwanted symbols from cod4
      if (value == "") request.data[key] = null;
    }

    io.emit("message", request);
  });
});

(async () => {
  expressServer
    .listen({
      host: "127.0.0.1",
      port: 8000,
    })
    .on("listening", () => {
      console.log("Express server listening on port 8000");
    });
})();
