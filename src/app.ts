import { jwtSecret, mongoURI } from "./config";
import path from "path";
import express from "express";

import connectDB from "./db/connect";

// route
import { authRouter, messageRouter } from "./route";

//middleware
import cookieParser from "cookie-parser";

// security middleware
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

// custom middleware
import {errorHandler, authenticateUser} from "./middleware";

// documentation
import swaggerUI from "swagger-ui-express";
import yaml from "yamljs";

const app = express();

const docs = yaml.load(path.join(__dirname, '..', 'swagger.yaml'));
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(String(jwtSecret)));

app.use(express.static('public'));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/messages", authenticateUser, messageRouter);

app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(mongoURI);
    app.listen(PORT, () => {
      console.log(`server is listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
