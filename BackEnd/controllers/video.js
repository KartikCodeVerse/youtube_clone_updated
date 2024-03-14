import VideoFiles from "../models/videoFiles.js";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload a '.mp4' video file only" });
    }

    const { title, channel, uploader, colorTone, mute, startTime, endTime } =
      req.body;
    const { originalname, path: inputFilePath, mimetype, size } = req.file;
    const uniqueIdentifier = Date.now();
    console.log(originalname);
    // Create an array to store metadata of different quality versions
    const qualityVersions = [];

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, "../uploads");
    await fs.mkdir(outputDir, { recursive: true });

    // Define different quality resolutions
    const qualities = [
      { resolution: "320x240", suffix: "320p" },
      { resolution: "640x480", suffix: "480p" },
      { resolution: "1280x720", suffix: "720p" },
      { resolution: "1920x1080", suffix: "1080p" },
    ];

    // Transcode video into different resolutions
    for (const { resolution, suffix } of qualities) {
      const outputFilePath = path.join(
        outputDir,
        `${title}_${uniqueIdentifier}_${suffix}.mp4`
      );

      console.log("outputfilepath:", outputFilePath);

      const ffmpegCommand = ffmpeg(inputFilePath)
        .outputOptions([
          `-vf scale=${resolution}`,
          `-ss ${startTime || 0}`,
          `-t ${endTime ? endTime - startTime : ""}`,
        ])
        .output(outputFilePath);
      // Apply color tone filter if specified
      if (colorTone && colorTone !== "#ffffff") {
        ffmpegCommand.outputOptions([`-vf hue=h=${colorTone}`]);
      }
      if (mute === "true") {
        ffmpegCommand.outputOptions(["-an"]);
      }

      await new Promise((resolve, reject) => {
        ffmpegCommand
          .on("end", () => {
            // Store metadata of the transcoded video in the array
            qualityVersions.push({
              quality: suffix,
              filePath: path.relative(__dirname, outputFilePath),
            });
            resolve();
          })
          .on("error", (err) =>
            reject(new Error(`Failed to process video: ${err.message}`))
          )
          .run();
      });
    }

    // Create a new VideoFiles document with metadata
    const videoEntry = new VideoFiles({
      videoTitle: title,
      fileName: originalname,
      filePath: qualityVersions,
      fileType: mimetype,
      fileSize: size,
      videoChannel: channel,
      uploader: uploader,
    });

    // Save the document in the database
    await videoEntry.save();

    // Clean up - delete the original uploaded file
    await fs.unlink(inputFilePath);

    // Send response
    console.log("File uploaded successfully");
    res.status(201).send("File uploaded successfully");
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    res.status(500).send(error.message);
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideoFiles.find();
    res.status(200).send(videos);
  } catch (error) {
    console.error("Error in getAllVideos:", error);
    res.status(500).send(error.message);
  }
};
