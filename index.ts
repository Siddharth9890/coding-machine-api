import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const xss = require("xss-clean");
import coreRouter from "./routes/core.router";
import { mongoConnection } from "./mongoConnection";
import { apiLimiter } from "./utils";

dotenv.config({ path: ".env" });

export const app = express();

app.use(
  cors({
    origin: ["https://coding-machine.pages.dev"],
    credentials: true,
  })
);

app.use("/*", apiLimiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use(express.json({ limit: "5mb" }));
app.use(coreRouter);

if (process.env.NODE !== "production") {
  console.log("comming from index.ts");

  mongoConnection(app);
}

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
