const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const aws = require("aws-sdk");
require("dotenv").config();
const { AudioModel } = require("../models/audio.model");

const audioRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

audioRoutes.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

audioRoutes.post("/", upload.single("audio"), async (req, res) => {
  const { originalname, buffer } = req.file;

  const params = {
    Bucket: "myaudiofilesstore",
    Key: `${uuidv4()}-${originalname}`,
    Body: buffer,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error uploading file to S3");
    }

    const audio = new AudioModel({
      name: originalname,
      audioUrl: data.Location,
    });

    await audio.save();
    res.json(audio);
  });
});

audioRoutes.get("/getaudio", async (req, res) => {
  try {
    const audios = await AudioModel.find();
    res.json(audios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = {
  audioRoutes,
};
