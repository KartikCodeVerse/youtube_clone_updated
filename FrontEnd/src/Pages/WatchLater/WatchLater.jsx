import React from "react";
import "./WatchLater.css";
import LeftSideBar from "../../Components/SideBar/LeftSideBar.jsx";
import WHL from "../../Components/WHL/WHL.jsx";
// import vid1 from "../../assets/Video/vid1.mp4";
// import vid2 from "../../assets/Video/vid2.mp4";
// import vid3 from "../../assets/Video/vid3.mp4";
import { useSelector } from "react-redux";
const WatchLater = () => {
  const watchLater = useSelector((state) => state?.watchLaterReducer);

  // const watchLater = [
  //   {
  //     _id: 1,
  //     video_src: vid1,
  //     Chennel: "62bafe6752a6c30685f",
  //     title: "video 1",
  //     uploder: "abc",
  //     description: "description of video 1",
  //   },
  //   {
  //     _id: 2,
  //     video_src: vid2,
  //     Chennel: "62bafe6752a6c30685f",
  //     title: "video 1",
  //     uploder: "def",
  //     description: "description of video 2",
  //   },
  //   {
  //     _id: 3,
  //     video_src: vid3,
  //     Chennel: "62bafe6752a6c30685f",
  //     title: "video 1",
  //     uploder: "ghi",
  //     description: "description of video 3",
  //   },
  // ];
  return (
    <div className="watchlater_page">
      <LeftSideBar />
      <WHL videoList={watchLater} page={"Watch Later"} />;
    </div>
  );
};

export default WatchLater;
