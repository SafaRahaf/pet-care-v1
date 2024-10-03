import { Request, Response, NextFunction } from "express";

const checkDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const send = res.send;

  res.send = function (body: any) {
    if (
      !body ||
      (Array.isArray(body) && body.length === 0) ||
      (typeof body === "object" && Object.keys(body).length === 0)
    ) {
      return res.status(404).json({
        success: false,
        message: "No Data Found",
        data: [],
      });
    }
    return send.call(this, body);
  };

  next();
};

export default checkDataMiddleware;
