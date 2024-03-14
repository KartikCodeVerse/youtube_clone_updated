import React from "react";
import "./Quality.css";

const Quality = ({ selectedQuality, handleQualityChange }) => {
  const qualityOptions = ["1080p", "720p", "480p", "320p"];

  return (
    <div className="quality-buttons">
      {qualityOptions.map((quality) => (
        <div
          key={quality}
          className={selectedQuality === quality ? "selected option" : "option"}
          onClick={() => handleQualityChange(quality)}
        >
          {quality}
        </div>
      ))}
    </div>
  );
};

export default Quality;
