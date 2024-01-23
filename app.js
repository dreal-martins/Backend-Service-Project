const express = require("express");
const connectDb = require("./utils/db");
const app = express();
require("dotenv").config({ path: "./utils/config.env" });
require("express-async-errors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/authentication");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());

connectDb();
app.get("/", (req, res) => {
  res.send("Backend Service Project");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", auth, userRouter);
app.use("/api/v1/post", auth, postRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}...`));
