import { randomBytes } from "crypto";
import express, { Request, Response } from "express";
import { sendMessage } from "../config/rabbitmq";
import { errorResponse, successResponse } from "../utils";
import JobModel from "../models/JobModel";
const router = express.Router();

router.post("/submit", async (request: Request, response: Response) => {
  try {
    if (request.body.code === undefined) {
      return response
        .status(400)
        .json({ success: false, error: "code cannot be empty!" });
    }
    let data = {
      code: request.body.code,
      language: request.body.language,
      fileName: randomBytes(10).toString("hex"),
    };

    const job = await JobModel.create(data);
    await sendMessage(job.fileName);
    response.status(202).send(successResponse(job.fileName));
  } catch (error) {
    response.status(500).send(errorResponse(500, "System error"));
  }
});

router.get(
  "/check-status/:id",
  async (request: Request, response: Response) => {
    try {
      let key = request.params.id;
      if (key === undefined) {
        return response
          .status(400)
          .json({ success: false, error: "missing id " });
      }
      const job = await JobModel.findOne({ fileName: key });

      if (job.status === "queued") {
        response.status(200).send({ status: "Queued" });
      } else if (job.status === "processing") {
        response.status(200).send({ status: "Processing" });
      } else {
        response.status(200).send(successResponse(job.status));
      }
    } catch (error) {
      response
        .status(500)
        .json({ success: false, status: "Something went wrong" });
    }
  }
);

router.get("/result/:id", async (request: Request, response: Response) => {
  try {
    let key = request.params.id;
    if (key === undefined) {
      return response
        .status(400)
        .json({ success: false, error: "missing id " });
    }
    const job = await JobModel.findOne({ fileName: key });

    response.status(200).send(successResponse(job));
  } catch (error) {
    response
      .status(500)
      .json({ success: false, status: "Something went wrong" });
  }
});

export default router;
