const mongoose = require("mongoose");

const audioSchema = mongoose.Schema(
  {
    name: String,
    audioUrl: String,
  },
  {
    versionKey: false,
  }
);

const AudioModel = mongoose.model("Audio", audioSchema);

module.exports = {
  AudioModel,
};
