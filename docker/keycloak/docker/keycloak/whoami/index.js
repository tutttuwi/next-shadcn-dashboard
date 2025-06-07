const express = require("express");
const app = express();

// app.get("/", (req, res) => {
//   res.redirect("/me");
// });

app.get("/", (req, res) => {
  res.json({
    user: req.headers["x-user"],
    email: req.headers["x-email"],
    access_token: req.headers["x-access-token"],
    id_token: req.headers["x-id-token"],
  });
});

app.listen(3000, () => console.log("whoami app listening on port 3000"));
