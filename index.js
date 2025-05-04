const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3000;

app.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const form = new FormData();
  form.append("upload_session", "1"); // required by postimages
  form.append("numfiles", "1");
  form.append("gallery", "");
  form.append("code", "");
  form.append("optsize", "0");
  form.append("expire", "0");
  form.append("upload[]", fs.createReadStream(file.path));

  try {
    const response = await axios.post("https://postimages.org/json", form, {
      headers: {
        ...form.getHeaders()
      }
    });

    fs.unlinkSync(file.path); // remove local file after upload

    res.json({
      status: "success",
      url: response.data.url,
      thumb: response.data.thumb_url,
      author: {
        Name: "MOHAMMAD-JUBAYER",
        Facebook: "https://www.facebook.com/profile.php?id=61573052122735"
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
