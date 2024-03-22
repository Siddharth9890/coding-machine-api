import express, { Request, Response } from "express";
import { sendMessage } from "../config/sqs";
import { errorResponse, generateRandomNumber, successResponse } from "../utils";
import JobModel from "../models/JobModel";
const router = express.Router();

router.post("/submit", async (request: Request, response: Response) => {
  try {
    if (
      request.body.code === undefined ||
      typeof request.body.code != "string"
    ) {
      return response
        .status(400)
        .send(
          errorResponse(
            400,
            "Code cannot be empty!.It should be of type string only"
          )
        );
    }
    let data = {
      code: request.body.code,
      language: request.body.language,
      submissionId: generateRandomNumber(),
    };

    const job = await JobModel.create(data);
    await sendMessage(job.submissionId, data.submissionId);
    return response.status(201).send(successResponse(job.submissionId.toString()));
  } catch (error) {
    console.log(error);
    return response.status(500).send(errorResponse(500, "Something went wrong"));
  }
});

router.get("/check-status", async (request: Request, response: Response) => {
  try {
    let { submissionId } = request.query;
    if (submissionId === undefined || typeof submissionId != "string") {
      return response.status(400).json({
        success: false,
        error: "Missing submissionId. It should be of type string only",
      });
    }
    const job = await JobModel.findOne({ submissionId: { $eq: submissionId } });
    if (job !== null) {
      if (job.status === "queued") {
        return response.status(200).send({ status: "Queued" });
      } else if (job.status === "processing") {
        return response.status(200).send({ status: "Processing" });
      } else {
        return response.status(200).send(successResponse(job.status));
      }
    }
    return response.status(200).send({ status: "Not Found!" });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ success: false, status: "Something went wrong" });
  }
});

router.get("/result", async (request: Request, response: Response) => {
  try {
    let { submissionId } = request.query;
    if (submissionId === undefined || typeof submissionId != "string") {
      return response.status(400).json({
        success: false,
        error: "Missing submissionId. It should be of type string only",
      });
    }
    const job = await JobModel.findOne({ submissionId: { $eq: submissionId } });

    return response.status(200).send(successResponse(job));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ success: false, status: "Something went wrong" });
  }
});

export default router;
