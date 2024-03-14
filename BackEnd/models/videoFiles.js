// models/videoFiles.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const videoFilesSchema = new Schema({
  videoTitle: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: [
    {
      quality: String,
      filePath: String,
    },
  ],
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  videoChannel: {
    type: String,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
  },
});

const VideoFiles = mongoose.model("VideoFiles", videoFilesSchema);

export default VideoFiles;
