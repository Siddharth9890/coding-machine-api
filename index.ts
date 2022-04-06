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
  windowMs: 500,
  handler: function (req: Request, res: Response, next: NextFunction) {
    return res.status(429).json({
      error: "You sent too many requests. Please wait a while then try again",
    });
  },
});

const PORT = process.env.PORT || 5000;
const app = express();

// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://coding-machine.pages.dev"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

var whitelist = ["https://coding-machine.pages.dev"];
var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  preflightContinue: true,
};

// Then pass them to cors:
// app.options("*", cors({ preflightContinue: true }));
app.use(cors(corsOptions));

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
