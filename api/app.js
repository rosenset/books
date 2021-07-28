const express = require("express");
const rateLimit = require("express-rate-limit"); //for brute force attack
const xss = require("xss-clean"); //for XSS attack (remove script tags)
const booksRoutes = require("./routes/booksRoutes");
const cors = require("./utility/cors");
const morgan = require("morgan");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1hr
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "you've exceed the number of requests",
});

const app = express();

// Middlewares
// Handle CORS
app.use(cors);
// Rate Limiting
app.use(limiter);
app.use(express.json());
// Api calls logging
app.use(morgan("dev"));
// Prevent xss attack
app.use(xss());

//routers
app.use("/api/v1/books", booksRoutes);

module.exports = app;
