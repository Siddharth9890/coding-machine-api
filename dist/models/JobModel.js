"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    language: {
        type: String,
        required: true,
        enum: ["c++", "python", "java"],
    },
    code: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        unique: true,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    timeOut: {
        type: Number,
        default: 5000,
    },
    status: {
        type: String,
        default: "queued",
        enum: ["queued", "processing", "completed"],
    },
    output: {
        type: String,
    },
});
const JobModel = mongoose_1.default.model("Job", jobSchema);
exports.default = JobModel;
