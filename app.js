require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const connectDB = require("./db/connect");

// route
const { authRouter } = require("./route");

//middleware
const cookieParser = require("cookie-parser");

// security middleware
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// custom middleware
const errorHandler = require("./middleware/errorHandler");

// documentation
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const docs = yaml.load("./swagger.yaml");

const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windows: 15 * 60 * 100,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.get("/", (req, res) => {
  res.send(
    "<h1>EPIC-MAIL API</h1><p>To learn more, read the <a href='/api-docs'>documentation</a></p>"
  );
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

app.use("/api/v1/auth", authRouter);

app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
