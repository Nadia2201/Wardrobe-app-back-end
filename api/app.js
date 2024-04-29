const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/items");
const outfitsRouter = require("./routes/outfits");
const authenticationRouter = require("./routes/authentication");
const { tokenChecker } = require("./middleware/tokenChecker"); // Destructure the middleware object

const app = express();

app.use(cors());




// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json({limit: '10mb'}));


// API Routes
app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.use("/outfits", outfitsRouter);
app.use("/tokens", authenticationRouter);

// Logout route with tokenChecker middleware
app.post("/users/logout", tokenChecker, async (req, res) => {
  try {
    // Optionally perform any additional logout logic here
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});



module.exports = app;
