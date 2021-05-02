const express = require("express");
const qrcode = require("qrcode");
const app = express();
const Cryptr = require("cryptr");
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let url;
let cryptr;
let error = false
app.get("/", (req, res) => {
  url = "Enter URL";
  qrcode.toDataURL(url, (err, encodedURL) => {
    res.render("index", { encodedURL ,error });
    error=false 
  });
});
app.post("/gencode", (req, res) => {
  if (req.body) {
    url = req.body.url;
    encryption_key = req.body.encryption_key;
  }
  cryptr = new Cryptr(encryption_key);
  const encryptedString = cryptr.encrypt(url);
  qrcode.toDataURL(
    encryptedString,
    { errorCorrectionLevel: "H" },
    (err, encodedURL) => {
      res.render("index", { url, encodedURL });
    }
  );
});

app.post("/decode", (req, res, next) => {
  let encryption_key;
  let encoded_string;
  if (req.body) {
    encoded_string = req.body.encoded_string;
    encryption_key = req.body.encryption_key;
  }
  cryptr = new Cryptr(encryption_key);
  const decryptedURL = cryptr.decrypt(encoded_string);
  res.render("index", { decryptedURL, encoded_string });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500);
  error=true
  res.redirect("/");
});

app.listen(port, () => console.log("server connected"));
