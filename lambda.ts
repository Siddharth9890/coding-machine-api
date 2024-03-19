import serverlessHttp from "serverless-http";
import { app } from ".";
import { mongoConnection } from "./mongoConnection";

if (process.env.NODE === "production") {
  console.log("comming from lambda");
  mongoConnection(app);
}
export const handler = serverlessHttp(app);
