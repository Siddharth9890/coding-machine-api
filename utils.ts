import { Request, Response, NextFunction } from "express";
import rateLimiter from "express-rate-limit";

export const errorResponse = (code: number, message: string) => {
  return {
    status: false,
    data: null,
    error: {
      code: code,
      message: message,
    },
  };
};

export const successResponse = (data: any) => {
  return {
    status: true,
    data: data,
  };
};

export const generateRandomNumber = () => {
  let randomNumber = Math.floor(Math.random() * 1000000000);

  return randomNumber;
};

// this thing will not work as we are using lambdas but github scanning recommends to add it!
// also we have rate limiting configured on API GATEWAY side
export const apiLimiter = rateLimiter({
  max: 3,
  windowMs: 100,
  handler: function (req: Request, res: Response, next: NextFunction) {
    return res.status(429).json({
      error: "You sent too many requests. Please wait a while then try again",
    });
  },
});
