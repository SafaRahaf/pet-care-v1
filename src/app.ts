import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";
import cors from "cors";

const app: Application = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api", router);

const test = async (req: Request, res: Response) => {
  const title = "hallo Pet care Backend App";
  res.send(title);
};

app.get("/", test);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
