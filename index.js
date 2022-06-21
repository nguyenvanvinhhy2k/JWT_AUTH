const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("HelloWorld"));

app.listen(port, () => console.log(`http://localhost:${port}`));
