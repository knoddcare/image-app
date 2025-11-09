interface ResponseMessage {
  status: string;
  message: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public responseMessage?: ResponseMessage;
  constructor(message: string, statusCode: number, responseMessage?: ResponseMessage) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.responseMessage = responseMessage;
  }
}

export const ERROR_MESSAGES = {
  MISSING_FILE: "Missing file",
  NO_FILE_UPLOADED: "No file uploaded",
  INVALID_FILE_TYPE: "Invalid file type (only jpeg, png allowed)",
  MISSING_NAME: "Missing name",
  INVALID_INPUT: "Invalid input",
}