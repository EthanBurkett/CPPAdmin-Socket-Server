import http from "http";
import express from "express";
import mongoose from "mongoose";
import socketio from "socket.io";
import SettingsModel from "./models/Settings.model";

const app = express();
const expressServer = http.createServer(app);
const io = new socketio.Server(expressServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("message", async (message: string) => {
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

    const api_key = await SettingsModel.findOne({ key: "api_key" }).catch(
      () => null
    );
    if (!api_key || api_key.value !== request.api_key) {
      return;
    }

    io.emit("message", request);
  });
});

(async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://localhost:27017/cppadmin").then(() => {
    console.log("Connected to MongoDB");
  });

  expressServer
    .listen({
      host: "127.0.0.1",
      port: 8000,
    })
    .on("listening", () => {
      console.log("Express server listening on port 8000");
    });
})();
