const express = require("express");
const qrcode = require("qrcode");
const app = express();
const port = process.env.PORT||3000;

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let url;

app.get("/", (req, res) => {
  url = "Enter URL";
  qrcode.toDataURL(url, (err, encodedURL) => {
    console.log(encodedURL);
    res.render("index", { encodedURL });
  });
});

app.post("/gencode", (req, res) => {
  if (req.body.url) url = req.body.url;
  console.log(url);
  qrcode.toDataURL(url, { errorCorrectionLevel: "H" }, (err, encodedURL) => {
    console.log(encodedURL);
    res.render("index", { url, encodedURL });
  });
});

app.listen(port, () => console.log("server connected"));
