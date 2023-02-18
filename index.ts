import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
const xss = require("xss-clean");
import { Request, Response, NextFunction } from "express";
import coreRouter from "./routes/core.router";

dotenv.config({ path: ".env" });

const limiter = rateLimiter({
  max: 1,
  windowMs: 100,
  handler: function (req: Request, res: Response, next: NextFunction) {
    return res.status(429).json({
      error: "You sent too many requests. Please wait a while then try again",
    });
  },
});

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
 cors({
    origin: [
      "https://coding-machine.pages.dev",
    ],
    credentials: true,
  })
);

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose
  .connect(DB)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

app.use("/submit", limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use(express.json({ limit: "5mb" }));
app.use(coreRouter);

app.listen(PORT, () => {
  console.log(`Server started  on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
  console.log("SERVER CLOSING 😱 CALL THE ADMIN UNHANDLED REJECTION");
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log(error);
  console.log("SERVER CLOSING 😱 CALL THE ADMIN UNCAUGHT EXCEPTION");
  process.exit(1);
});
