import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import "./VideoUpload.css";
import { uploadVideo } from "../../Action/Video";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const VideoUpload = ({ setVidUploadpage }) => {
  const CurrentUser = useSelector((state) => state.currentUserReducer);

  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [colorTone, setColorTone] = useState("#ffffff");
  const [videoUrl, setVideoUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [trimRange, setTrimRange] = useState([0, 0]); // Default range
  const [videoDuration, setVideoDuration] = useState(0);

  const handleSetVideoFile = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const fileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setProgress(percentage);
      if (percentage === 100) {
        setTimeout(function () {}, 3000);
        setVidUploadpage(false);
      }
    },
  };

  const uploadVideoFile = () => {
    if (!title) {
      alert("Plz Enter a Title of the video");
    } else if (!videoFile) {
      alert("Plz Attach a video file");
    } else if (videoFile.size > 50000000) {
      alert("Plz Attach video file less than 50mb");
    } else {
      const fileData = new FormData();
      fileData.append("title", title);
      fileData.append("file", videoFile);
      fileData.append("channel", CurrentUser?.result._id);
      fileData.append("uploader", CurrentUser?.result.name);
      fileData.append("colorTone", colorTone);
      fileData.append("mute", muted);
      fileData.append("startTime", trimRange[0]);
      fileData.append("endTime", trimRange[1]);
      dispatch(
        uploadVideo({
          fileData: fileData,
          fileOptions: fileOptions,
        })
      );
    }
  };

  const hexToHueRotate = (hexColor) => {
    const hex = hexColor.replace("#", "");

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
      if (max === r) {
        hue = ((g - b) / delta) % 6;
      } else if (max === g) {
        hue = (b - r) / delta + 2;
      } else {
        hue = (r - g) / delta + 4;
      }
    }

    hue = Math.round(hue * 60);
    hue = (hue + 360) % 360;
    setColorTone(hue);
  };
  useEffect(() => {
    if (videoFile) {
      const player = document.createElement("video");
      player.src = URL.createObjectURL(videoFile);
      player.onloadedmetadata = () => {
        setVideoDuration(player.duration);
        setTrimRange([0, player.duration]);
      };
    }
  }, [videoFile]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSetTrimRange = (value) => {
    setTrimRange(value);
  };

  useEffect(() => {
    if (videoFile) {
      setVideoUrl(URL.createObjectURL(videoFile));
    }
  }, [videoFile]);

  return (
    <div className="video_upload">
      <input
        type="submit"
        name="text"
        value={"X"}
        className="ibtn_x"
        onClick={() => setVidUploadpage(false)}
      />
      <div className="video_upload2">
        <div className="ibox_div_vidUpload">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="ibox_vidupload"
            maxLength={30}
            placeholder="Enter Title of your video"
          />

          <label htmlFor="file" className="ibox_vidupload btn_vidUpload">
            <input
              onChange={(e) => handleSetVideoFile(e)}
              type="file"
              name="file"
              className="ibox_vidupload"
              style={{ fontSize: "1rem" }}
            />
          </label>
        </div>
        {videoFile && (
          <div>
            <div>
              <h3>Preview:</h3>
              <ReactPlayer
                url={videoUrl}
                controls
                muted={muted}
                width="400px"
                height="300px"
                style={{
                  filter: `sepia(50%) hue-rotate(${colorTone}deg)`,
                }}
              />
            </div>

            <div>
              <label>
                Trim Range: Start Time: {formatTime(trimRange[0])} | End Time:{" "}
                {formatTime(trimRange[1])}
                <Slider
                  range
                  min={0}
                  max={videoDuration}
                  value={trimRange}
                  onChange={handleSetTrimRange}
                />
              </label>
            </div>

            <div>
              <label>
                Color Tone:{" "}
                <input
                  type="color"
                  value={colorTone}
                  onChange={(e) => hexToHueRotate(e.target.value)}
                />{" "}
              </label>
            </div>
            <div>
              <label>
                Mute:{" "}
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={() => setMuted(!muted)}
                />
              </label>
            </div>
          </div>
        )}
        <div className="ibox_div_vidUpload">
          <input
            onClick={() => uploadVideoFile()}
            type="submit"
            value={"Upload"}
            className="ibox_vidupload btn_vidUpload"
          />
        </div>
        <div className="loader ibox_div_vidUpload">
          <CircularProgressbar
            value={progress}
            text={`${progress}`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: "butt",
              textSize: "20px",
              pathTransitionDuration: 0.5,
              pathColor: `rgba(255,255,255,${progress / 100})`,
              textColor: "#f88",
              trailColor: "#adff2f",
              backgroundColor: "#3e98c7",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
