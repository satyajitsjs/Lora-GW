import React from "react";
import "./Loading.css";

const Loading = ({ size }) => {
  return <div className="loader" style={{ width: size, height: size }}></div>;
};

export default Loading;
