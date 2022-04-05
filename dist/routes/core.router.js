"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rabbitmq_1 = require("../config/rabbitmq");
const utils_1 = require("../utils");
const crypto_1 = require("crypto");
const JobModel_1 = __importDefault(require("../models/JobModel"));
const router = express_1.default.Router();
router.post("/submit", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (request.body.code === undefined) {
            return response
                .status(400)
                .json({ success: false, error: "code cannot be empty" });
        }
        let data = {
            code: request.body.code,
            language: request.body.language,
            fileName: (0, crypto_1.randomBytes)(10).toString("hex"),
        };
        const job = yield JobModel_1.default.create(data);
        yield (0, rabbitmq_1.sendMessage)(job.fileName);
        response.status(202).send((0, utils_1.successResponse)(job.fileName));
    }
    catch (error) {
        response.status(500).send((0, utils_1.errorResponse)(500, "System error"));
    }
}));
router.get("/check-status/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let key = request.params.id;
        if (key === undefined) {
            return response
                .status(400)
                .json({ success: false, error: "missing id " });
        }
        const job = yield JobModel_1.default.findOne({ fileName: key });
        if (job.status === "queued") {
            response.status(200).send({ status: "Queued" });
        }
        else if (job.status === "processing") {
            response.status(200).send({ status: "Processing" });
        }
        else {
            response.status(200).send((0, utils_1.successResponse)(job.status));
        }
    }
    catch (error) {
        response
            .status(500)
            .json({ success: false, status: "Something went wrong" });
    }
}));
router.get("/result/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let key = request.params.id;
        if (key === undefined) {
            return response
                .status(400)
                .json({ success: false, error: "missing id " });
        }
        const job = yield JobModel_1.default.findOne({ fileName: key });
        response.status(200).send((0, utils_1.successResponse)(job));
    }
    catch (error) {
        response
            .status(500)
            .json({ success: false, status: "Something went wrong" });
    }
}));
exports.default = router;
