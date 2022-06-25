const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const dotenv = require("dotenv");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((error) => {
    console.log("mondb not connected");
    console.log(error);
  });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.listen(port, () => console.log(`http://localhost:${port}`));
