"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (code, message) => {
    return {
        status: "error",
        data: null,
        error: {
            code: code,
            message: message,
        },
    };
};
exports.errorResponse = errorResponse;
const successResponse = (data) => {
    return {
        status: "ok",
        data: data,
    };
};
exports.successResponse = successResponse;
