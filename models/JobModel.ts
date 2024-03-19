import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      enum: ["c++", "python", "java"],
    },
    code: {
      type: String,
      required: true,
    },
    submissionId: {
      type: Number,
      unique: true,
      required: true,
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
  },
  { timestamps: true }
);

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;
