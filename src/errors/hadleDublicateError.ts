import { TGenericErrorResponse, TErrorSources } from "../interface/error";

const handleDulicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorSource: TErrorSources = [
    {
      path: err.keyValue,
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate entry",
    errorSources: errorSource,
  };
};
export default handleDulicateError;
