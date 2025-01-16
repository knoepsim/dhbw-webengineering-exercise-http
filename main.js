var express = require("express");
var app = express();
app.listen(8080, () => {
  console.log("Listening on port 8080");
});

// example GET Endoint
app.get("/example", (req, res, next) => {
  res.json({ message: "This is an example endpoint." });
});
