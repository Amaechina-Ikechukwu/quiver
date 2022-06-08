const express = require("express");
const app = express();
const ngrok = require("ngrok");
const server = require("http").Server(app);
var cors = require("cors");
const port = "https://three-waves-enjoy-197-211-63-60.loca.lt";

const jwt = require("jsonwebtoken");

const VoximplantApiClient = require("@voximplant/apiclient-nodejs").default;
const client = new VoximplantApiClient(
  "/Users/LENOVO/projects/reactnative/quiver/backend/credentials.json"
);

// client.onReady = function () {
//   var data = {
//     userName: "Gordon",
//     userDisplayName: "Gordon",
//     userPassword: "1234567",
//     applicationId: "10464912",
//   };
//   // Add a new user.
//   client.Users.addUser({
//     userName: "Gordon",
//     userDisplayName: "Gordon",
//     userPassword: "1234567",
//     applicationId: "10464912",
//   })
//     .then((ev) => console.log(ev), "sucess")
//     .catch((err) => console.error(err), "error");
// };
function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}
app.get("/token", (req, res) => {
  const token = jwt.sign(req.body.userName, {
    expiresIn: "1800s",
  });
  res.send(JSON.stringify(token));
});
app.get("/", (req, res) => {
  client.onReady = function () {
    var data = {
      userName: "Gordon",
      userDisplayName: "Gordon",
      userPassword: "1234567",
      applicationId: "10464912",
    };
    // Add a new user.
    client.Users.addUser({
      userName: req.body.userName,
      userDisplayName: req.body.userDisplayName,
      userPassword: req.body.userPassword,
      applicationId: req.body.application,
    })
      .then(
        (ev) => (
          res.status(200).json({ message: ev }),
          res.send("Done" + JSON.stringify(ev))
        )
      )
      .catch((err) => res.json({ message: err }));
  };
});

server.listen(port, () => {
  console.log("This is Quiver");
});
