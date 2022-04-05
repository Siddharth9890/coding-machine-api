export const errorResponse = (code: number, message: string) => {
  return {
    status: "error",
    data: null,
    error: {
      code: code,
      message: message,
    },
  };
};

export const successResponse = (data: string) => {
  return {
    status: "ok",
    data: data,
  };
};
