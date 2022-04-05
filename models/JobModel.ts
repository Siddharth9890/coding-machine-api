import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
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

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;
