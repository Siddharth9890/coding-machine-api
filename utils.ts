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

export const successResponse = (data: string) => {
  return {
    status: true,
    data: data,
  };
};

export const generateRandomNumber = () => {
  let randomNumber = Math.floor(Math.random() * 1000000000);

  return randomNumber;
};
