import React, { useEffect, useState } from "react";
import moment from "moment";
import "./VideoPage.css";
import LikeWatchLaterSaveBtn from "./LikeWatchLaterSaveBtn";
import Comments from "../../Components/Comments/Comments";
import Quality from "../../Components/Quality/Quality";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addtoHistory } from "../../Action/History";
import { viewVideo } from "../../Action/Video";
import ShakaPlayer from "shaka-player-react";
import "shaka-player/dist/controls.css";

const VideoPage = () => {
  const [videourl, setvideourl] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("720p"); // Default quality
  const [settingsVisible, setSettingsVisible] = useState(false);
  // Get the URL
  const { vid } = useParams();
  // Get Vides
  const vids = useSelector((state) => state.videoReducer)?.data;
  // Getting Req. Video
  const video = vids?.filter((q) => q._id === vid)[0];

  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const dispatch = useDispatch();
  const handleHistory = () => {
    dispatch(
      addtoHistory({
        videoId: vid,
        viewer: CurrentUser?.result._id,
      })
    );
  };

  const handleViews = () => {
    dispatch(
      viewVideo({
        id: vid,
      })
    );
  };
  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
    // Set initial video URL to 720p quality
    if (video) {
      const defaultQualityFilePath = video?.filePath.find(
        (file) => file.quality === selectedQuality
      )?.filePath;
      if (defaultQualityFilePath) {
        setvideourl(`http://localhost:3000/${defaultQualityFilePath}`);
      }
    }
  }, []);

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    setSettingsVisible(false);

    // Find the selected quality's file path
    const selectedQualityFilePath = video?.filePath.find(
      (file) => file.quality === quality
    )?.filePath;

    // Update the video URL with the selected quality's file path
    if (selectedQualityFilePath) {
      setvideourl(`http://localhost:3000/${selectedQualityFilePath}`);
    }
  };
  return (
    <>
      <div className="video_page">
        <div className="video2_page">
          <div className="video_display">
            <div className="video-player">
              <ShakaPlayer className="videon" autoPlay src={videourl} />
              <div className="play-setting">
                <a
                  className="btn"
                  onClick={() => setSettingsVisible(!settingsVisible)}
                >
                  Quality : {selectedQuality}
                </a>{" "}
                {settingsVisible && (
                  <Quality
                    selectedQuality={selectedQuality}
                    handleQualityChange={handleQualityChange}
                  />
                )}
              </div>
            </div>

            <div className="video_details">
              <div className="video_btn">
                <p className="video_title">{video?.videoTitle}</p>
                <div className="video_views">
                  <div className="views">
                    {video?.Views} views <div className="dot"></div> Uploded{" "}
                    {moment(video?.createdAt).fromNow()}
                  </div>
                </div>
              </div>
              <LikeWatchLaterSaveBtn video={video} vid={vid} />
              <Link
                to={`/chanel/${video?.videoChanel}`}
                className="chanel_details"
              >
                <b className="chanel_logo">
                  <p>{video?.uploader.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name">{video?.uploader}</p>
              </Link>
              <div className="comments">
                <h2>
                  <u>Comments</u>
                </h2>
                <Comments videoId={video?._id} id={vid} />
              </div>
            </div>
          </div>
          <div className="more_videoBar">More Video</div>
        </div>
      </div>
    </>
  );
};

export default VideoPage;
