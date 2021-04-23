const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

//load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//route files
const auth = require("./routes/auth");
const boards = require("./routes/boards");
const users = require("./routes/users");
const lists = require("./routes/lists");
const cards = require("./routes/cards");
const comments = require("./routes/comments");
const files = require("./routes/files");

const app = express();

//body parser
app.use(express.json());

//development logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

//mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/boards", boards);
app.use("/api/v1/users", users);
app.use("/api/v1/lists", lists);
app.use("/api/v1/cards", cards);
app.use("/api/v1/comments", comments);
app.use("/api/v1/files", files);

app.use(errorHandler);

//cors
app.use(cors());

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server and exit process
  // server.close(() => process.exit(1))
});
