import express from "express";
import { config } from "../config/config";

import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRoutes from "./routes/userRoutes";
import accountRoutes from "./routes/accountRoutes";
import transferRoutes from "./routes/transferRoutes";

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = config
        const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/rest-api-db?authSource=admin`;
        mongoose.connect(MONGO_URI).then(db => console.log("db is connected"));
        //Settings
        this.app.set("port", process.env.PORT || 3000);

        // Middlewares
        this.app.use(express.json());
        this.app.use(cookieParser())
        this.app.use(cors());
    }

    routes() {
        this.app.use("/api/v1/users", userRoutes);
        this.app.use("/api/v1/accounts", accountRoutes);
        this.app.use("/api/v1/transfer", transferRoutes);
    }

    start() {
        this.app.listen(this.app.get("port"), () =>
            console.log("Server on port " + this.app.get("port"))
        );
    }
}

const server = new Server();

server.start();
