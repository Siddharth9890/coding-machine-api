"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss = require("xss-clean");
const core_router_1 = __importDefault(require("./routes/core.router"));
dotenv_1.default.config({ path: ".env" });
const limiter = (0, express_rate_limit_1.default)({
    max: 1,
    windowMs: 10000,
    handler: function (req, res, next) {
        return res.status(429).json({
            error: "You sent too many requests. Please wait a while then try again",
        });
    },
});
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB)
    .then(() => console.log("connected to db"))
    .catch((error) => console.log(error));
app.use("/submit", limiter);
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use(xss());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "5mb" }));
app.use(core_router_1.default);
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
