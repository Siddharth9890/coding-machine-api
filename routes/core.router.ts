import express, { Request, Response } from "express";
import { sendMessage } from "../config/sqs";
import { errorResponse, generateRandomNumber, successResponse } from "../utils";
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
      submissionId: generateRandomNumber(),
    };

    const job = await JobModel.create(data);
    await sendMessage(job.submissionId, data.submissionId);
    response.status(201).send(successResponse(job.submissionId));
  } catch (error) {
    console.log(error);
    response.status(500).send(errorResponse(500, "Something went wrong"));
  }
});

router.get("/check-status", async (request: Request, response: Response) => {
  try {
    let { submissionId } = request.query;
    if (submissionId === undefined) {
      return response
        .status(400)
        .json({ success: false, error: "missing submissionId" });
    }
    const job = await JobModel.findOne({ submissionId });
    if (job.status === "queued") {
      response.status(200).send({ status: "Queued" });
    } else if (job.status === "processing") {
      response.status(200).send({ status: "Processing" });
    } else {
      response.status(200).send(successResponse(job.status));
    }
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, status: "Something went wrong" });
  }
});

router.get("/result", async (request: Request, response: Response) => {
  try {
    let { submissionId } = request.query;
    if (submissionId === undefined) {
      return response
        .status(400)
        .json({ success: false, error: "missing submissionId" });
    }
    const job = await JobModel.findOne({ submissionId });

    response.status(200).send(successResponse(job));
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, status: "Something went wrong" });
  }
});

export default router;
