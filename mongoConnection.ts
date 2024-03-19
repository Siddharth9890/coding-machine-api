import mongoose from "mongoose";
import { Express } from "express";
const PORT = process.env.PORT || 5001;

const DB = process.env.DATABASE!;

export const mongoConnection = (app: Express) => {
  mongoose
    .connect(DB)
    .then(() => {
      console.log("connected to db");
      app.listen(PORT, async () => {
        // to restore data from file important as indexes will be rebuild by mongoose
        // await restoreMain();
        console.log(`Server started  on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.log(error);
      throw new Error("DB CONNECTION FAILED");
    });
};
